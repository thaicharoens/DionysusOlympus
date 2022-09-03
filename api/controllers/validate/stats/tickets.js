/**
 * tickets/claim
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { eventId } = req.allParams();
    // const decodedJWT = await sails.helpers.aadB2C.with({ jwt: req.headers.authorization.split('Bearer ')[1] });
    // const agentEventAuthorised = await colAgent.findOne({ user: decodedJWT.sub,event: Event.getDatastore().driver.mongodb.ObjectId(eventId),role:'SCAN_AGENT' }, { session });
    // if (!agentEventAuthorised) {
    //   scanResult = {
    //     status: false,
    //     rejectReason: 'You are not authorised to scan this event'
    //   };
    //   return;
    // }

    

    return res.status(200).json({
      status: true,
      total: await Ticket.count({ event: eventId }),
      scanned: await Ticket.count({ event: eventId, scanned: true }),
      unscanned: await Ticket.count({ event: eventId, scanned: false }),
    });
  }
};
