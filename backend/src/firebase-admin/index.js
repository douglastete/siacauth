const firebaseAdmin = require('firebase-admin');

const serviceAccount = require('./siacauth-firebase-adminsdk-ipxt8-6ea97c817e.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://siacauth.firebaseio.com'
});

module.exports = firebaseAdmin;
