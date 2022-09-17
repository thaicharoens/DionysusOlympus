/**
 * admin/tickets/ticket
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { id } = req.allParams();
    sails.log('Fetching ticket');
    const ticket = await Ticket.findOne({id: id}).sort({name: 'ASC'});
    if (!ticket) {
      return res.status(400).json({
        status: false,
        message:'Ticket not found'
      });
    }
    return res.status(200).json({
      status: true,
      message:'Ticket returned',
      ticket: ticket
    });
  }
};
