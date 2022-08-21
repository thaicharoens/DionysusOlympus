/**
 * admin/events/set-total-qty
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { eventId, totalQty } = req.allParams();
    const db = Event.getDatastore().manager;
    const dbClient = db.client;
    const session = dbClient.startSession();
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    };
    await session.withTransaction(async () => {
      const colEvent = db.collection('event');
      const eventObjectId = Event.getDatastore().driver.mongodb.ObjectId(eventId);
      const event = await colEvent.findOne({ _id: eventObjectId }, { session });
      if (!event) {
        throw new Error('Event not found');
      }
      sails.log(event);

      sails.log(`There are: ${event.soldQty} tickets sold, ${event.inCartQty} tickets in cart`);
      const inUseQty = event.soldQty + event.inCartQty;
      const availableQty = Math.max(0,totalQty - inUseQty);
      await colEvent.updateOne({_id: eventObjectId},{ $set: {totalQty: totalQty, availableQty: availableQty} }, { session });
    }, transactionOptions);
    sails.log('Out of transaction');

    return res.send({
      status: true,
      message: 'Set totalQTY and availableQTY for event'
    });
  }
};

