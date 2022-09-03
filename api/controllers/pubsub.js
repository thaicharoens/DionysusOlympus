/**
 * tickets/claim
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const decodedJWT = await sails.helpers.aadB2C.with({ jwt: req.headers.authorization.split('Bearer ')[1] });
    //    const agentAuthorisedEvents = await Agent.find({ user: decodedJWT.sub, role:'SCAN_AGENT' });
    let pubsubToken = await sails.helpers.pubsubClient().getClientAccessToken( { userId: decodedJWT.sub });

    return res.status(200).json({
      status: true,
      url: pubsubToken.url
    });
  }
};
