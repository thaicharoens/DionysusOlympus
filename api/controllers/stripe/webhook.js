/**
 * stripe/webhook
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const fulfillOrder =async function(paymentIntent) {
  let cart = await Cart.findOne({ paymentIntentId: paymentIntent.id });
  if (!cart) {
    throw new Error('Cart not found');
  }
  if (cart.paymentStatus !== 'ON_STRIPE_CHECKOUT') {
    throw new Error('Cart is not in checkout state');
  }
  sails.log(`Fulfilling order for cart ${cart.id}`);
  await Cart.updateOne({ id: cart.id }, {
    paymentStatus: 'CAPTURING',
  });
  //const captureResult = await stripe.paymentIntents.capture(paymentIntent.id);
  //sails.log(`Capture result: ${JSON.stringify(captureResult)}`);
  await Cart.updateOne({ id: cart.id }, {
    paymentStatus: 'PAID',
  });
  cart = await Cart.findOne({ id: cart.id });
  sails.log(`Cart ${cart.id} is now PAID, issuing tickets`);


  const order =
  await sails.helpers.ticket.issue.with({event: cart.event,qty:cart.qty,uid:cart.uid,fromCart: true});
  sails.log(order);
  sails.log(`Order ${order.id} created, tickets issued`);
  await Cart.updateOne({ id: cart.id }, {
    order: order.id,
  });
  return true;
};

module.exports = {
  fn: async function () {
    const { req, res } = this;
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      sails.log(err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    sails.log(event);


    switch (event.type) {
      case 'payment_intent.amount_capturable_updated': {
        sails.log('payment_intent.amount_capturable_updated');
        const session = event.data.object;
        await fulfillOrder(session);
        break;
      }
    }
    return res.status(200).json(event);
  }
};
