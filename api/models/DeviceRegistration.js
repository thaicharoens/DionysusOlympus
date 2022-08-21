/**
 * DeviceRegistration.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    deviceId: {
      type: 'string',
      required: true,
    },
    uid: {
      type: 'string',
      required: true,
    },
    scanditDeviceId: {
      type: 'string',
      required: false
    }
  },

};

