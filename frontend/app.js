import AddToHomeScreen from 'a2hs.js';

import { authFirebase } from './src/assets/js/auth';

init();

function init() {
  registerServiceWorker();
  authFirebase.listenerState();
  adjustImagePWA();
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(function(reg) {
        if (reg.installing) {
          console.log('Service worker installing');
        } else if (reg.waiting) {
          console.log('Service worker installed');
        } else if (reg.active) {
          console.log('Service worker active');
        }
      })
      .catch(function(error) {
        console.log('Registration failed with ' + error);
      });
  }
}

function adjustImagePWA() {
  const img = document.getElementById('imgA2HS');
  img.remove();
  img.removeAttribute('hidden');

  AddToHomeScreen({
    brandName: 'SIAC Auth',
    backgroundColor: '#428bca',
    color: 'white',
    logoImage: img.outerHTML,
    htmlContent:
      'Instale o app <strong>SIAC Auth</strong> no seu dispositivo iOS: clique em compartilhar e <strong>Adicionar à Tela de Início</strong>'
  });
}
