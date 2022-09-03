module.exports = {


  friendlyName: 'Pubsub',


  description: 'Pubsub something.',

  sync: true,
  inputs: {

  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: function () {
    const { WebPubSubServiceClient } = require('@azure/web-pubsub');
    const serviceClient = new WebPubSubServiceClient(process.env.PUBSUB_CONNECTION_STRING, 'dionysusolympus');
    return serviceClient;
  }


};

