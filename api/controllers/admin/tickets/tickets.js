/**
 * admin/tickets/tickets
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { event } = req.allParams();
    sails.log('Fetching all tickets');
    const tickets = await Ticket.find({event: event});
    sails.log(`Fetched ${tickets.length} tickets`);
    return res.status(200).json({
      status: true,
      message:'All tickets returned',
      tickets: tickets.map((ticket) => {
        delete ticket.event.image;
        return ticket;
      })
    });
  }
};
