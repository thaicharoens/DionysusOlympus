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
    name: {
      type: 'string',
    },
    order:{
      model:'order',
    },
    uid: {
      type: 'string',
      required: false,
    },
    email: {
      type: 'string',
      required: false,
    },
    claimed: {
      type: 'boolean',
      required: true,
    },
    claimable: {
      type: 'boolean',
      required: true,
    },
    scanned: {
      type: 'boolean',
      defaultsTo: false,
    },
    transferable: {
      type: 'boolean',
      defaultsTo: true,
    },
    cancelled: {
      type: 'boolean',
      defaultsTo: false,
    },

    special: {
      type: 'boolean',
      defaultsTo: false,
    },
    specialMessage: {
      type: 'string',
      required: false,
    },
    passkitPassId: {
      type: 'string',
      required: false,
      allowNull: true,
    },
    barcode: {
      type: 'string',
      required: true,
    }
  },

};

