import { authFirebase } from '../../assets/js/auth';
import { navigateTo } from '../../assets/js/navigation';
import { insertNewUser } from './login.service';

document.getElementById('btnLoginGoogle').addEventListener('click', async () => {
  if (await authFirebase.loginWithGoogle()) {
    if (authFirebase.isNewUser()) {
      insertNewUser();
    }

    navigateTo('/home');
  }
});
