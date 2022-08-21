/**
 * cart/new
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { v4: uuidv4 } = require('uuid');

module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { event:eventId, qty } = req.body;


    const db = Order.getDatastore().manager;
    const dbClient = db.client;
    const session = dbClient.startSession();
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    };
    let cartId;
    try {
      await session.withTransaction(async () => {
        const colEvent = db.collection('event');
        const colCart = db.collection('cart');

        const eventObjectId = Event.getDatastore().driver.mongodb.ObjectId(eventId);
        const event = await colEvent.findOne({ _id: eventObjectId }, { session });
        if (!event) {
          throw new Error('Event not found');
        }
        sails.log(event);

        const newAvailableQty = event.availableQty - qty;
        const newInCartQty = event.inCartQty + qty;
        sails.log(`newAvailableQty: ${newAvailableQty}`);
        if (newAvailableQty < 0) {
          throw new Error('SOLD_OUT');
        }

        cartId = (await colCart.insertOne({
          event: eventId,
          qty: qty,
          key: uuidv4()
        }, { session })).insertedId;

        await colEvent.updateOne({_id: eventObjectId},{ $set: {availableQty: newAvailableQty, inCartQty: newInCartQty} }, { session });
      }, transactionOptions);
      sails.log('Out of transaction');
    }catch (error) {
      sails.log(error);
      if (error.message === 'SOLD_OUT') {
        return res.status(400).json({
          status: false,
          message: 'Sold out',
          soldOut: true
        });
      }
    }

    if (!cartId) {
      return res.status(400).json({
        status: false,
        message:'Error creating cart'
      });
    }
    const newCart = await Cart.findOne({id: String(cartId)});
    sails.log('newCart', newCart);

    return res.status(200).json({
      status: true,
      message:'Cart created',
      cart: newCart
    });
  }
};
