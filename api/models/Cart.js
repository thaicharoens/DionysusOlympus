/**
 * Cart.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    event:{
      model:'event',
    },
    order:{
      model:'order',
    },
    qty: {
      type: 'number',
      required: true,
    },
    key: {
      type: 'string',
      required: true,
    },
    //This needs to be required false as we create the cart unauthenticated, then authenticate at payment time
    uid: {
      type: 'string',
      required: false,
    }
  },

};

