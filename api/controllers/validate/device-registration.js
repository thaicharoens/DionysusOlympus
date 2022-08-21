/**
 * validate/device-registration
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  fn: async function () {
    const { req, res } = this;
    //const decodedJWT = await sails.helpers.aadB2C.with({ jwt: req.headers.authorization.split('Bearer ')[1] });
    //mock whilst we arent actually enforcing sign in to Artemis
    const decodedJWT = {
      sub: '19a93084-6c58-48de-9abc-49681c9bfcee'
    };

    const db = DeviceRegistration.getDatastore().manager;
    const dbClient = db.client;
    const session = dbClient.startSession();
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    };
    let deviceRegistrationId;
    await session.withTransaction(async () => {
      const colDeviceRegistration = db.collection('deviceRegistration');
      const existingRegistation = await colDeviceRegistration.findOne({ deviceId: req.body.deviceId }, { session });
      if (existingRegistation) {
        console.log(`Device ${req.body.deviceId} already registered, updating`);
        await colDeviceRegistration.updateOne({_id: existingRegistation._id},{ $set: {uid: decodedJWT.sub, scanditDeviceId: req.body.scanditDeviceId} }, { session });
        deviceRegistrationId = existingRegistation._id;
        console.log(`Device ${req.body.deviceId} registration updated`);
      } else {
        console.log(`Device ${req.body.deviceId} registering`);
        const deviceRegistration = await colDeviceRegistration.insertOne({ deviceId: req.body.deviceId,uid: decodedJWT.sub,scanditDeviceId: req.body.scanditDeviceId }, { session });
        deviceRegistrationId = deviceRegistration.insertedId;
        console.log(`Device ${req.body.deviceId} registered`);
      }
    }, transactionOptions);
    sails.log('Out of transaction');

    return res.status(200).json({
      status: true,
      message: 'Device registered successfully',
      deviceRegistrationId: deviceRegistrationId
    });
  }
};
