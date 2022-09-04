/**
 * pubsub/token
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const decodedJWT = await sails.helpers.aadB2C.with({ jwt: req.headers.authorization.split('Bearer ')[1] });
    const pubsubRoles = [];
    const agentAuthorisedEvents = await Agent.find({ user: decodedJWT.sub, role:'SCAN_AGENT' });
    [...new Set(agentAuthorisedEvents.map((agent) => {
      return agent.event;
    }))].forEach((event) => {
      pubsubRoles.push(`webpubsub.joinLeaveGroup.event_${event}_scanned`);
    });
    let pubsubToken = await sails.helpers.pubsubClient().getClientAccessToken( { userId: decodedJWT.sub,roles: pubsubRoles } );

    return res.status(200).json({
      status: true,
      url: pubsubToken.url
    });
  }
};
