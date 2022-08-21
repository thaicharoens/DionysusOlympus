/**
 * Transfer.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    ticket:{
      model:'ticket',
    },
    from: {
      type: 'string',
    },
    to:{
      type: 'string',
    },
  },

};

