/**
 * tickets/tickets
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    sails.log('Validating JWT');
    const decodedJWT = await sails.helpers.aadB2C.with({ jwt: req.headers.authorization.split('Bearer ')[1] });
    sails.log('Matching tickets by email to user');
    const userEmail = await sails.helpers.aadB2CUidEmail.with({uid:decodedJWT.sub});
    await Ticket.update({ email: userEmail.toLowerCase() }, { email: '', uid: decodedJWT.sub});
    await Order.update({ email: userEmail.toLowerCase() }, { email: '', uid: decodedJWT.sub});


    sails.log('Fetching tickets for user');
    const tickets = await Ticket.find({ uid:  decodedJWT.sub }).populate('event');
    sails.log(`Fetched ${tickets.length} tickets`);
    return res.status(200).json({
      status: true,
      message:'Tickets for user returned',
      tickets: tickets.map((ticket) => {
        delete ticket.event.image;
        return ticket;
      })
    });
  }
};
