/**
 * order/order
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { key } = req.allParams();
    const order = await Order.findOne({ key: key }).populate('event');
    console.log('order', order);
    if (!order) {
      return res.status(400).json({
        status: false,
        message:'Order not found'
      });
    }
    order.totalPrice = order.qty * order.event.price;

    return res.status(200).json({
      status: true,
      message:'Order returned',
      order: order
    });
  }
};
