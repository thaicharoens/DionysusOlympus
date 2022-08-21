const CryptoJS = require('crypto-js');

function generateJWT(key, secret) {
  var body = {
    'uid': key,
    'exp': Math.floor(new Date().getTime() / 1000) + 3600,
    'iat': Math.floor(new Date().getTime() / 1000),
    'web': true,
  };

  header = {
    'alg': 'HS256',
    'typ': 'JWT'
  };
  var token = [];
  token[0] = base64url(JSON.stringify(header));
  token[1] = base64url(JSON.stringify(body));
  token[2] = genTokenSign(token, secret);

  return token.join('.');
}

function genTokenSign(token, secret) {
  if (token.length !== 2) {
    return;
  }
  var hash = CryptoJS.HmacSHA256(token.join('.'), secret);
  var base64Hash = CryptoJS.enc.Base64.stringify(hash);
  return urlConvertBase64(base64Hash);
}


function base64url(input) {
  var base64String = btoa(input);
  return urlConvertBase64(base64String);
}

function urlConvertBase64(input) {
  var output = input.replace(/=+$/, '');
  output = output.replace(/\+/g, '-');
  output = output.replace(/\//g, '_');

  return output;
}


module.exports = {


  friendlyName: 'Passkit com jwt',


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
    return generateJWT('7phqxrwCFxJs1ZJ8TRnjQI', '+o2iU9dPKahZ8XP6JIHrvS5R2u5QXk/MEaEgELeU');
  }


};

