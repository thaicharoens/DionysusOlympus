const azureJWT = require('azure-jwt-verify');

module.exports = {

  friendlyName: 'Azure Active Directory B2C',


  description: '',


  inputs: {
    jwt: {
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      description: 'All done.',
    },
    unknownAudience: {
      description: 'The audience of the JWT is unknown.',
    }

  },


  fn: async function (inputs) {
    sails.log(inputs);

    const config = {
      JWK_URI: 'https://okonetworkb2c.b2clogin.com/okonetworkb2c.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1_camelotTest',
      ISS: 'https://okonetworkb2c.b2clogin.com/d5349bdd-3739-44ee-afac-b46347b5a11e/v2.0/',
      //AUD: '81173864-6ca0-4380-b943-63fe7e4a519f'
    };
    const decodedJWTRes = await azureJWT.verify(inputs.jwt, config);
    const decodedJWT = JSON.parse(decodedJWTRes).message;
    switch (decodedJWT.aud) {
      case '81173864-6ca0-4380-b943-63fe7e4a519f':
        sails.log(`JWT issued for Dionysus application`);
        break;
      case '5bf4d52c-10de-498b-b860-369390bf9846':
        sails.log(`JWT issued for Artemis application`);
        break;
      default:
        throw({unknownAudience: {aud: decodedJWT.aud}});
    }
    decodedJWT.uid = decodedJWT.sub;
    return decodedJWT;
  }


};

