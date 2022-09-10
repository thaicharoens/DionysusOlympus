/**
 * global/roles/current
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const decodedJWT = await sails.helpers.aadB2C.with({ jwt: req.headers.authorization.split('Bearer ')[1] });
    const userRoles = await GlobalRole.find({ user: decodedJWT.sub });
    const roles = [...new Set(userRoles.map((role) => role.role))];
    return res.status(200).json({
      status: true,
      roles: roles
    });
  }
};
