const deepmerge = require('deepmerge');
const envSettings = require(`./env/${process.env.NODE_ENV}`);

const settings = {
  "mailer": {
    "user": 'contact@notesalong.com',
    "password": 'na_22209!'
  },
  "auth": {
    "sharedSecret": "tN3kQ4U0pIMt035G129l",
    "accessTokenTTL": "15 days", // In parsed string: https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    "refreshTokenTTL": "31536000", // In seconds
    "providers": {
      "google": "Google"
    }
  },
  "mongo": {
    "host": `notes-mongo/notesalong-${process.env.NODE_ENV}`
  },
  "basic": {
    maxCollections: 3
  }
}

module.exports = deepmerge(settings, envSettings);
