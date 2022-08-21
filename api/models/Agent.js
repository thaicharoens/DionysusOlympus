/**
 * Agent.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    event:{
      model:'event',
      required: true
    },
    role: {
      type: 'string',
      required: true,
    },
    user: {
      type: 'string',
      required: true
    }
  },

};

