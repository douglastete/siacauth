import AddToHomeScreen from 'a2hs.js';

import { authFirebase } from './src/assets/js/auth';

init();

function init() {
  authFirebase.listenerState();
  adjustImagePWA();
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
      'Instale o app <strong>SIAC Auth</strong> no seu dispositivo iOS: clique em compartilhar and <strong>Adicionar à Tela de Início</strong>'
  });
}
