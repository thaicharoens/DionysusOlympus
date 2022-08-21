const RandExp = require('randexp');

module.exports = {


  friendlyName: 'Generate a barcode',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },
  sync: true,

  fn: function () {
    return new RandExp(/^[0-9]{18}/).gen();

  }


};

