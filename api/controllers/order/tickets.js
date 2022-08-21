/**
 * order/tickets
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { key } = req.allParams();
    const decodedJWT = await sails.helpers.aadB2C.with({ jwt: req.headers.authorization.split('Bearer ')[1] });
    const order = await Order.findOne({ key: key });
    console.log('order', order);
    if (!order) {
      return res.status(400).json({
        status: false,
        message:'Order not found'
      });
    }

    const tickets = await Ticket.find({ order: order.id, uid:  decodedJWT.sub }).populate('event');

    return res.status(200).json({
      status: true,
      message:'Tickets for order returned',
      tickets: tickets
    });
  }
};
