import * as materialize from 'materialize-css';
import PullToRefresh from 'pulltorefreshjs';

import { authFirebase } from '../../assets/js/auth';
import { apiClient } from '../../assets/js/axios.factory';
import { companyLogged } from '../../assets/js/companyLogged';

const io = require('socket.io-client');
const socket = io.connect(process.env.SOCKET_URL_BASE);

init();

function init() {
  PullToRefresh.init({
    mainElement: '#divContainer',
    instructionsPullToRefresh: 'Arraste para atualizar',
    instructionsReleaseToRefresh: 'Solte para atualizar',
    instructionsRefreshing: 'Atualizando...',
    async onRefresh() {
      await getOrders();
    }
  });

  const btnRefresh = document.getElementById('btnRefresh');
  btnRefresh.addEventListener('click', () => {
    getOrders();
  });
  getOrders();
  configureRealTime();
}

function configureRealTime() {
  socket.on('changeData', payload => {
    console.log(payload);
    if (payload.operationType === 'insert') {
      createOrder(payload.fullDocument);
    } else if (payload.operationType == 'delete') {
      removeOrder(payload.documentKey._id);
    } else if (payload.operationType == 'replace') {
      if (payload.fullDocument.liberado || payload.fullDocument.cancelado) {
        removeOrder(payload.documentKey._id);
      } else {
        removeOrder(payload.documentKey._id);
        createOrder(payload.fullDocument);
      }
    } else if (payload.operationType == 'update') {
      const fields = payload.updateDescription.updatedFields;
      if ((fields.cancelado && fields.cancelado === true) || (fields.liberado && fields.liberado === true)) {
        removeOrder(payload.documentKey._id);
      }
    }
  });
}

async function getOrders(showPreLoader = true) {
  if (!authFirebase || !authFirebase.isLogged()) {
    console.warn('usuário não autenticado...');
    return;
  }

  if (!companyLogged || !companyLogged.isSelected()) {
    console.warn('Empresa não selecionada...');
    return;
  }

  if (showPreLoader === true) {
    showLoader();
  }

  await showOrders();

  if (showPreLoader === true) {
    removeLoader();
  }
}

async function clearOrders() {
  const container = document.getElementById('divOrders');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function showEmptyInfo() {
  const container = document.getElementById('divOrders');
  const divRow = document.createElement('div');
  divRow.className = 'row';
  divRow.id = 'divNenhumPedido';
  container.appendChild(divRow);

  const divCol = document.createElement('div');
  divCol.className = 'col s12 m6 l4 margin-auto';
  divRow.appendChild(divCol);

  const divCard = document.createElement('div');
  divCard.className = 'card blue lighten-1';
  divCol.appendChild(divCard);

  const divCardContent = document.createElement('div');
  divCardContent.className = 'card-content white-text';
  divCard.appendChild(divCardContent);

  const spanTitle = document.createElement('span');
  spanTitle.className = 'card-title';
  spanTitle.innerText = 'Não há nenhum pedido a ser liberado!';
  divCardContent.appendChild(spanTitle);
}

async function removeOrder(order) {
  const container = document.getElementById('divOrders');
  container.childNodes.forEach(element => {
    if (element.order && element.order._id === order) {
      container.removeChild(element);
      return;
    }
  });
  if (container.childElementCount === 0) {
    showEmptyInfo();
  }
}

async function showOrders() {
  let orders = [];

  await clearOrders();

  await apiClient()
    .get(`/orders?liberado=false&cancelado=false&empresaid=${companyLogged.company.empresaid}`)
    .then(resp => {
      orders = resp.data.response;
    });

  if (!orders || orders.length === 0) {
    showEmptyInfo();
    return;
  }

  orders.forEach(order => {
    createOrder(order);
  });
}

function createOrder(order) {
  const divNenhumPedido = document.getElementById('divNenhumPedido');
  if (divNenhumPedido) {
    divNenhumPedido.remove();
  }

  const container = document.getElementById('divOrders');
  const divCol = document.createElement('div');
  divCol.order = order;
  divCol.className = 'pedido col s12 m6';
  container.appendChild(divCol);

  const divCard = document.createElement('div');
  divCard.className = 'card blue lighten-1';
  divCol.appendChild(divCard);

  const divCardContent = document.createElement('div');
  divCardContent.className = 'card-content white-text activator';
  divCard.appendChild(divCardContent);

  const spanTitle = document.createElement('span');
  spanTitle.className = 'card-title';
  spanTitle.innerText = `Pedido Nº: ${order.pedidoid}`;
  divCardContent.appendChild(spanTitle);

  const txtCliente = document.createElement('p');
  txtCliente.innerText = `Cliente: ${order.razaosocial}`;
  divCardContent.appendChild(txtCliente);

  const txtDtEmissao = document.createElement('p');
  txtDtEmissao.innerText = `Dt. de emissão: ${order.dtemissao.replace(/-/g, '/')}`;
  divCardContent.appendChild(txtDtEmissao);

  const txtVlrMovimento = document.createElement('p');
  txtVlrMovimento.innerText = `Valor do pedido: ${order.vlrtotal}`;
  divCardContent.appendChild(txtVlrMovimento);

  const divCardCancelar = document.createElement('div');
  divCardCancelar.className = 'card-action white left';
  divCard.appendChild(divCardCancelar);

  const btnCancelar = document.createElement('a');
  btnCancelar.className = 'card-text black-text';
  btnCancelar.innerText = 'Cancelar';
  btnCancelar.order = order;
  btnCancelar.addEventListener('click', cancelOrder);
  divCardCancelar.appendChild(btnCancelar);

  const iconCancelar = document.createElement('i');
  iconCancelar.className = 'material-icons';
  iconCancelar.innerText = 'highlight_off';
  btnCancelar.appendChild(iconCancelar);

  const divMotivos = document.createElement('div');
  divMotivos.className = 'card-action white left ';
  divCard.appendChild(divMotivos);

  const btnMotivos = document.createElement('a');
  btnMotivos.className = 'card-text black-text modal-trigger';
  btnMotivos.innerText = 'Motivos';
  btnMotivos.order = order;
  btnMotivos.addEventListener('click', showCauses);
  divMotivos.appendChild(btnMotivos);

  const iconMotivos = document.createElement('i');
  iconMotivos.className = 'material-icons';
  iconMotivos.innerText = 'horizontal_split';
  btnMotivos.appendChild(iconMotivos);

  const divCardLiberar = document.createElement('div');
  divCardLiberar.className = 'card-action white right';
  divCard.appendChild(divCardLiberar);

  const btnLiberar = document.createElement('a');
  btnLiberar.className = 'card-text black-text';
  btnLiberar.innerText = 'Liberar';
  btnLiberar.order = order;
  btnLiberar.addEventListener('click', unlockOrder);
  divCardLiberar.appendChild(btnLiberar);

  const iconLiberar = document.createElement('i');
  iconLiberar.className = 'material-icons';
  iconLiberar.innerText = 'check_circle';
  btnLiberar.appendChild(iconLiberar);
}

async function unlockOrder(el) {
  const order = el.target.order;
  order.liberado = true;
  order.emailliberacao = authFirebase.userLogged.email;
  order.dtliberacao = new Date();

  await apiClient()
    .put(`/orders/${order._id}`, order)
    .then(resp => {
      if (resp.data.success) {
        removeOrder(order._id);
        const card = el.target.parentNode.parentNode;
        const container = card.parentNode;
        container.remove(card);
        M.toast({ html: `Pedido ${order.pedidoid} liberado com sucesso!` });
      }
    })
    .catch(e => alert(e));
}

async function cancelOrder(el) {
  const order = el.target.order;
  order.cancelado = true;
  order.emailcancelamento = authFirebase.userLogged.email;
  order.dtcancelamento = new Date();

  await apiClient()
    .put(`/orders/${order._id}`, order)
    .then(resp => {
      if (resp.data.success) {
        removeOrder(order._id);
        M.toast({ html: `Pedido ${order.pedidoid} cancelado com sucesso!` });
      }
    })
    .catch(e => alert(e));
}

function clearElement(el) {
  el.querySelectorAll('*').forEach(n => n.remove());
  el.innerHTML = '';
  return el;
}

function showCauses(el) {
  const modalContent = clearElement(document.querySelector('.modal-content'));

  const header = document.createElement('h4');
  header.innerText = 'Motivos do bloqueio';
  modalContent.appendChild(header);

  el.target.order.motivos.forEach(e => {
    const cause = document.createElement('p');
    cause.innerText = e.motivo + '\n\n';
    modalContent.appendChild(cause);
  });

  materialize.Modal.init(document.querySelector('.modal'), {}).open();
}

function showLoader() {
  const divLoader = document.createElement('div');
  divLoader.className = 'preloader-wrapper big active';
  divLoader.id = 'divLoader';

  const divSpinner = document.createElement('div');
  divSpinner.className = 'spinner-layer spinner-blue-only';
  divLoader.appendChild(divSpinner);

  const divCliperLeft = document.createElement('div');
  divCliperLeft.className = 'circle-clipper left';
  divSpinner.appendChild(divCliperLeft);

  const divCircle = document.createElement('div');
  divCircle.className = 'circle';
  divCliperLeft.appendChild(divCircle);

  const divGap = document.createElement('div');
  divGap.className = 'gap-patch';
  divSpinner.appendChild(divGap);

  const divCircle2 = document.createElement('div');
  divCircle2.className = 'circle';
  divGap.appendChild(divCircle2);

  const divCliperRight = document.createElement('div');
  divCliperRight.className = 'circle-clipper right';
  divSpinner.appendChild(divCliperRight);

  const divCircle3 = document.createElement('div');
  divCircle3.className = 'circle';
  divCliperRight.appendChild(divCircle3);

  const divContainer = document.getElementById('divContainer');
  divContainer.appendChild(divLoader);
}

function removeLoader() {
  document.getElementById('divLoader').remove();
}
