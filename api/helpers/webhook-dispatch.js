const { Svix } = require('svix');
const svix = new Svix(process.env.SVIX_TOKEN, { serverUrl: 'https://api.eu.svix.com' });
const { v4: uuidv4 } = require('uuid');

module.exports = {


  friendlyName: 'Webhook dispatch',


  description: '',


  inputs: {
    eventType: {
      type: 'string',
      required: true,
      description: 'The type of event to dispatch',
      example: 'event.created'
    },
    payload: {
      type: 'ref',
      required: true,
      description: 'The payload of the event',
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    const dispatchRes = await svix.message.create('app_2C2gCyKi8M6oIgM3unI5H4dGb2b', {
      eventType: inputs.eventType,
      eventId: uuidv4(),
      payload: inputs.payload,
    });
    sails.log(dispatchRes);
    return dispatchRes;
  }


};

