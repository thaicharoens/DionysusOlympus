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
    //@todo add a helper to check if current user is authorized with ROLE for EVENT
    const decodedJWT = await sails.helpers.aadB2C.with({ jwt: req.headers.authorization.split('Bearer ')[1] });
    const agentEventAuthorised = await Agent.find({ user: decodedJWT.sub,event: eventId, role:'SCAN_AGENT' });
    if (!Boolean(agentEventAuthorised.length)) {
      scanResult = {
        status: false,
        rejectReason: 'You are not authorised to scan this event'
      };
      return;
    }
    return res.status(200).json({
      status: true,
      total: await Ticket.count({ event: eventId }),
      scanned: await Ticket.count({ event: eventId, scanned: true }),
      unscanned: await Ticket.count({ event: eventId, scanned: false }),
    });
  }
};
