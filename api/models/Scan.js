/**
 * Scan.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    agent: {
      type: 'string',
      required: true,
    },
    device: {
      type: 'string',
      required: true,
    },
    ticket: {
      type: 'string',
      required: true,
    },
    event: {
      model: 'event',
      required: true
    },
    result: {
      type: 'string',
      required: true,
    },
    reason: {
      type: 'string',
      required: false,
    },
  },

};

