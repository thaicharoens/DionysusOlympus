/**
 * cart/cart
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { key } = req.allParams();
    const cart = await Cart.findOne({ key: key }).populate('event');
    console.log('cart', cart);
    if (!cart) {
      return res.status(400).json({
        status: false,
        message:'Cart not found'
      });
    }
    cart.totalPrice = cart.qty * cart.event.price;

    return res.status(200).json({
      status: true,
      message:'Cart returned',
      cart: cart
    });
  }
};
