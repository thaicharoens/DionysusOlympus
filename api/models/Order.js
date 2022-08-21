/**
 * Order.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    event:{
      model:'event',
    },
    qty: {
      type: 'number',
      required: true,
    },
    key: {
      type: 'string',
      required: true,
    },
    uid: {
      type: 'string',
      required: false,
    },
    email: {
      type: 'string',
      required: false,
    },
    externalTransactionIdLabel: {
      type: 'string',
      required: false,
    },
    externalTransactionId: {
      type: 'string',
      required: false,
    }
  },

};

