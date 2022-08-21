/**
 * Event.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    image: {
      type: 'string',
      required: true,
    },
    price: {
      type: 'number',
      required: true,
    },
    currency: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    startTime: {
      type: 'number',
      required: true,
    },

    totalQty: {
      type: 'number',
      defaultsTo: 0,
    },
    availableQty: {
      type: 'number',
      defaultsTo: 0,
    },
    inCartQty: {
      type: 'number',
      defaultsTo: 0,
    },
    soldQty: {
      type: 'number',
      defaultsTo: 0,
    },
    cancelledQty: {
      type: 'number',
      defaultsTo: 0,
    }
  },

};

