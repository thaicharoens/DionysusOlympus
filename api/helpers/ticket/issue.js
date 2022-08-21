const { v4: uuidv4 } = require('uuid');

module.exports = {


  friendlyName: 'Issue',


  description: 'Issue ticket.',


  inputs: {
    event:{
      type:'string',
    },
    qty: {
      type: 'number',
    },
    uid: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    fromCart: {
      type: 'boolean',
    },
    externalTransactionIdLabel: {
      type: 'string',
    },
    externalTransactionId: {
      type: 'string',
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    const orderCreate = {
      key:  uuidv4(),
      event: inputs.event,
      qty: inputs.qty
    };
    if (inputs.uid) {
      orderCreate.uid = inputs.uid;
    } else {
      const uidByEmail = await sails.helpers.aadB2CLookup.with({email:inputs.email.toLowerCase()});
      if (uidByEmail) {
        orderCreate.uid = uidByEmail;
        orderCreate.email = '';
      } else {
        orderCreate.uid = '';
        orderCreate.email = inputs.email.toLowerCase();
      }
    }

    if (inputs.externalTransactionIdLabel) {
      orderCreate.externalTransactionIdLabel = inputs.externalTransactionIdLabel;
    }
    if (inputs.externalTransactionId) {
      orderCreate.externalTransactionId = inputs.externalTransactionId;
    }


    const db = Order.getDatastore().manager;
    const dbClient = db.client;
    const session = dbClient.startSession();
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    };
    let orderId;
    await session.withTransaction(async () => {
      const colEvent = db.collection('event');
      const colOrder = db.collection('order');
      const colTicket = db.collection('ticket');
      const eventObjectId = Event.getDatastore().driver.mongodb.ObjectId(orderCreate.event);
      const event = await colEvent.findOne({ _id: eventObjectId }, { session });
      if (!event) {
        throw new Error('Event not found');
      }
      delete(event.image);
      sails.log(event);



      const order = orderCreate;
      order._id = (await colOrder.insertOne(orderCreate, { session })).insertedId;
      orderId = order._id;
      sails.log(order);
      sails.log(`Order ${order._id} created`);


      const ticketsToCreate = [...Array(orderCreate.qty)].map(() => {
        return {
          event: Event.getDatastore().driver.mongodb.ObjectID(orderCreate.event),
          order: Order.getDatastore().driver.mongodb.ObjectID(orderCreate._id),
          claimed: false,
          claimable: true,
          uid: orderCreate.uid,
          email: orderCreate.email,
          special: false,
          cancelled: false,
          transferable: true,
          scanned: false,
          barcode: sails.helpers.ticket.generateBarcode()
        };
      });
      await colTicket.insertMany(ticketsToCreate, { session });

      await colEvent.updateOne({_id: eventObjectId},{ $set: {soldQty: event.soldQty + orderCreate.qty} }, { session });
      if (inputs.fromCart) {
        sails.log('Decrementing inCartQty');
        await colEvent.updateOne({_id: eventObjectId},{ $set: {inCartQty: event.inCartQty - orderCreate.qty} }, { session });
      } else {
        sails.log('Decrementing availableQty');
        await colEvent.updateOne({_id: eventObjectId},{ $set: {availableQty: event.availableQty - orderCreate.qty} }, { session });
      }
      sails.log('Updated QTY');
    }, transactionOptions);
    sails.log('Out of transaction');
    const order = await Order.findOne({id: String(orderId)}).populate('event');
    sails.log(order);
    sails.log(`Order ${order.id} created and tickets issued`);

    if (order.uid) {
      sails.log('We have the UID of the user');
      const userEmail = await sails.helpers.aadB2CUidEmail.with({uid:order.uid});
      //@TODO send claim tickets now (has user) email
      await sails.helpers.email.send.with({
        template:'d-f52ae427662e4907bfc4fa7d347824e8',
        to:userEmail,
        data: order
      });
    } else {
      sails.log('We do not have the UID of the user');
      await sails.helpers.email.send.with({
        template:'d-f52ae427662e4907bfc4fa7d347824e8',
        to:order.email,
        data: order
      });
    }

    delete(order.event.image);
    return order;
  }


};

