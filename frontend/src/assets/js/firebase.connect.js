import 'firebase/auth';

import firebase from 'firebase/app';

class FirebaseConnect {
  constructor() {
    this.firebaseConfig = {
      apiKey: 'AIzaSyBjPWdeBbw5Y7JbKXFeMXZYysclIhCGX-U',
      authDomain: 'siacauth.firebaseapp.com',
      databaseURL: 'https://siacauth.firebaseio.com',
      projectId: 'siacauth',
      storageBucket: 'siacauth.appspot.com',
      messagingSenderId: '959687061746',
      appId: '1:959687061746:web:2d57322a3888cbd88f206b',
      measurementId: 'G-M82F1KJT9N'
    };

    this.fireApp = firebase.initializeApp(this.firebaseConfig);
    this.fireAuth = firebase.auth(this.fireApp);
  }
}

export let firebaseConnect = new FirebaseConnect();
