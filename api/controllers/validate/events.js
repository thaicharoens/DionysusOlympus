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
    let eventsForUser = await Agent.find({ user: decodedJWT.sub }).populate('event');
    eventsForUser = eventsForUser.filter((userRole) => {
      return userRole.role === 'SCAN_AGENT';
    }).map((userRole) => {
      return userRole.event;
    }).map((event) => {
      delete(event.image);
      return event;
    }).filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.place === value.place && t.name === value.name
      ))
    );

    return res.status(200).json({
      status: true,
      events: eventsForUser,
    });
  }
};
