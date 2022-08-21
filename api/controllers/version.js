/**
 * tickets/claim
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    return res.status(200).json({
      status: true,
      version: process.env.GIT_SHA,
    });
  }
};
