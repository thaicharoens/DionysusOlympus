/**
 * validate/validate
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const decodedJWT = await sails.helpers.aadB2C.with({ jwt: req.headers.authorization.split('Bearer ')[1] });

    const db = Scan.getDatastore().manager;
    const dbClient = db.client;
    const session = dbClient.startSession();
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    };
    let scanResult;
    await session.withTransaction(async () => {
      const colScan = db.collection('scan');
      const colTicket = db.collection('ticket');
      const colAgent = db.collection('agent');

      const agentEventAuthorised = await colAgent.findOne({ user: decodedJWT.sub,event: Event.getDatastore().driver.mongodb.ObjectId(req.body.event),role:'SCAN_AGENT' }, { session });
      if (!agentEventAuthorised) {
        scanResult = {
          status: false,
          rejectReason: 'You are not authorised to scan this event'
        };
        return;
      }

      const ticket = await colTicket.findOne({ barcode: String(req.body.barcode) }, { session });
      if (!ticket) {
        scanResult = {
          status: false,
          rejectReason: 'Ticket not found'
        };
        return;
      }
      if (String(ticket.event) !== String(req.body.event)) {
        const scanInsert = await colScan.insertOne({
          agent: decodedJWT.sub,
          device: req.body.deviceId,
          ticket: ticket._id,
          event: req.body.event,
          result: 'REJECT',
          reason: 'WRONG_EVENT'
        }, { session });
        scanResult = {
          status: false,
          rejectReason: 'Ticket not for this event',
          scanId: scanInsert.insertedId
        };
        return;
      }

      //so if we are here, we have a ticket and an event match, need to check if it's an already successfully scanned ticket
      const scan = await colScan.findOne({ ticket: ticket._id, event: req.body.event, result: 'SUCCESS' }, { session });
      if (scan) {
        const scanInsert = await colScan.insertOne({
          agent: decodedJWT.sub,
          device: req.body.deviceId,
          ticket: ticket._id,
          event: req.body.event,
          result: 'REJECT',
          reason: 'ALREADY_SCANNED'
        }, { session });

        scanResult = {
          status: false,
          rejectReason: 'Ticket has already been scanned',
          scanId: scanInsert.insertedId
        };
        return;
      } else {
        const scanInsert = await colScan.insertOne({
          agent: decodedJWT.sub,
          device: req.body.deviceId,
          ticket: ticket._id,
          event: req.body.event,
          result: 'SUCCESS'
        }, { session });
        scanResult = {
          status: true,
          scanId: scanInsert.insertedId,
          ticket: ticket
        };
        await colTicket.updateOne({_id: ticket._id},{ $set: {scanned: true} }, { session });

        //patch whilst we dont actually have ticket types
        scanResult.ticket.type = {
          name: 'Individual'
        };
        return;
      }
    }, transactionOptions);
    sails.log('Out of transaction');


    return res.status(200).json({
      status: true,
      scanResult: scanResult
    });
  }
};
