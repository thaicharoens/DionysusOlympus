/* eslint-disable camelcase */
/**
 * cart/pay
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require('moment');
module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { key } = req.allParams();
    const decodedJWT = await sails.helpers.aadB2C.with({ jwt: req.headers.authorization.split('Bearer ')[1] });

    const customerDetails = {
      email: decodedJWT.emails[0],
      firstName: decodedJWT.given_name,
      lastName: decodedJWT.family_name,
      uid: decodedJWT.sub,
    };

    let cart = await Cart.findOne({ key: key }).populate('event');
    console.log('cart', cart);
    if (!cart) {
      return res.status(400).json({
        status: false,
        message:'Cart not found'
      });
    }
    await Cart.updateOne({ key: key }, {
      email:customerDetails.email,
      firstName: customerDetails.firstName,
      lastName: customerDetails.lastName,
      paymentStatus: 'CREATING_SESSION',
      uid: customerDetails.uid,
    });
    cart = await Cart.findOne({ key: key }).populate('event');



    cart.totalPrice = cart.qty * cart.event.price;
    cart.event.dateTimeUser = moment
    .unix(cart.event.startTime)
    .format('dddd, MMMM Do YYYY, h:mm a');
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      customer_email: cart.email,
      client_reference_id: cart.id,
      line_items: [
        {
          price_data: {
            currency: cart.event.currency,
            product_data: {
              name: `${cart.event.name} (${cart.event.dateTimeUser})`,
              description: cart.event.description,
            },
            unit_amount: cart.event.price
          },
          quantity: cart.qty,
        },
      ],
      mode: 'payment',
      metadata: {
        key: key,
      },
      success_url: `https://map.dionysusticketing.app/cart/processing/${key}`,
      cancel_url: `https://map.dionysusticketing.app/cart?paymentCancel=true`,
      //expire this in an hour (*1)
      expires_at: Math.floor(Date.now() / 1000) + (3600 * 1),
      payment_intent_data: {
        capture_method: 'manual'
      }
    });
    sails.log(session);
    await Cart.updateOne({ key: key }, {
      paymentStatus: 'ON_STRIPE_CHECKOUT',
      checkoutSessionId: session.id,
      paymentIntentId: session.payment_intent,
    });
    return res.status(200).json({
      status: true,
      url: session.url,
    });
  }
};
