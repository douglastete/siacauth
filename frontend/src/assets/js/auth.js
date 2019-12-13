import firebase from 'firebase/app';

import { apiClient } from '../../assets/js/axios.factory';
import { firebaseConnect } from './firebase.connect';
import { navigateTo } from './navigation';

class AuthFirebase {
  constructor() {
    this.googleProvider = new firebase.auth.GoogleAuthProvider();
    this.clearSession();
  }

  async loginWithGoogle() {
    try {
      this.userCredential = await firebaseConnect.fireAuth.signInWithPopup(this.googleProvider);

      await this.startSession(this.userCredential.user);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async startSession(user) {
    this.userLogged = user;
    await this.getToken();

    await apiClient()
      .get(`/users?email=${this.userLogged.email}`)
      .then(async resp => {
        if (!resp.data.response || resp.data.response.length == 0) {
          console.warn('Usuário não localizado na base de dados!');
          console.log(this.token);
          await apiClient()
            .post('/users')
            .then(resp => {
              console.log(resp);
            });
          return;
        }

        this.userLogged.companies = resp.data.response[0].empresas;
      });

    setInterval(() => {
      this.getToken(true);
    }, 1000 * 60 * 58);
  }

  async getToken(refreshToken = false) {
    this.token = await this.userLogged.getIdToken(refreshToken);
  }

  isLogged() {
    return this.token && this.userLogged;
  }

  isNewUser() {
    return this.userCredential && this.userCredential.additionalUserInfo.isNewUser;
  }

  async logout() {
    try {
      await firebaseConnect.fireAuth.signOut();
      this.clearSession();
      return true;
    } catch (error) {
      return false;
    }
  }

  clearSession() {
    this.userCredential = null;
    this.userLogged = null;
    this.token = '';
    window.authInstance = null;
    window.empresaLogada = null;
  }

  listenerState() {
    firebaseConnect.fireAuth.onAuthStateChanged(async user => {
      if (user) {
        await this.startSession(user);
        navigateTo('/home');
      } else {
        navigateTo('/login');
      }
    });
  }
}

function createInstance() {
  if (!window.authInstance) {
    window.authInstance = new AuthFirebase();
  }
  return window.authInstance;
}

export let authFirebase = createInstance();
