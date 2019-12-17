const firebaseAdmin = require('firebase-admin');

const serviceAccount = require('./firebase-adminsdk.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL_FIREBASE
});

module.exports = firebaseAdmin;
