import 'firebase/auth';

import firebase from 'firebase/app';

class FirebaseConnect {
  constructor() {
    this.firebaseConfig = {
      apiKey: process.env.APIKEY,
      authDomain: process.env.AUTHDOMAIN,
      databaseURL: process.env.DATABASEURL,
      projectId: process.env.PROJECTID,
      storageBucket: process.env.STORAGEBUCKET,
      messagingSenderId: process.env.MESSAGINGSENDERID,
      appId: process.env.APPID
    };

    this.fireApp = firebase.initializeApp(this.firebaseConfig);
    this.fireAuth = firebase.auth(this.fireApp);
  }
}

export let firebaseConnect = new FirebaseConnect();
