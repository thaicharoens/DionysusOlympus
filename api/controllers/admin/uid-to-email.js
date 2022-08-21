/**
 * tickets/claim
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { uid } = req.allParams();
    return res.send({
      status: true,
      message: 'Email address if found returned in emailed key',
      email: await sails.helpers.aadB2CUidEmail.with({uid:uid})
    });
  }
};

