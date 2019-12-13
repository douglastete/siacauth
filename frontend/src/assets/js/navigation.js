import Axios from 'axios';

import { authFirebase } from '../../assets/js/auth';

const routes = {
  '/login': { path: '/src/pages/login/login.html', target: 'app-root' },
  '/home': { path: '/src/pages/home/home.html', target: 'app-root' },
  '/empresas': { path: '/src/pages/empresas/empresas.html', target: 'app-home' },
  '/pedidos': { path: '/src/pages/pedidos/pedidos.html', target: 'app-home' }
};

export function navigateTo(route) {
  route = route.toLowerCase();

  if (!routes[route]) {
    console.warn('rota não definida!', route);
    return;
  }

  if (location.hash === `#${route}`) {
    loadPageAjax(routes[route].path, routes[route].target);
    return;
  }

  location.hash = route;
}

window.addEventListener('hashchange', event => {
  event.stopImmediatePropagation();
  const route = location.hash.replace('#', '');

  if (!routes[route]) {
    console.warn('rota não definida!', route);
    return;
  }

  const isLogged = authFirebase && authFirebase.isLogged();
  if (route !== '/login' && !isLogged) {
    navigateTo('/login');
  }

  loadPageAjax(routes[route].path, routes[route].target);
});

function loadPageAjax(page, target) {
  Axios.get(page).then(value => {
    const parser = new DOMParser();
    const html = parser.parseFromString(value.data, 'text/html');
    const temp = document.importNode(html.querySelector('template'), true);

    const elementTarget = clearElement(target);
    elementTarget.append(temp.content);

    setActiveLink();
  });
}

function clearElement(el) {
  const result = document.getElementById(el);
  result.querySelectorAll('*').forEach(n => n.remove());
  result.innerHTML = '';
  return result;
}

function setActiveLink(path) {
  const elements = document.querySelectorAll('nav ul li a, .sidenav li a');
  elements.forEach(item => {
    item.closest('li').classList.remove('active');
  });

  document.querySelectorAll(`[href="${location.hash}"]:not(.brand-logo)`).forEach(item => {
    item.closest('li').classList.add('active');
  });
}
