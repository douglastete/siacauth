import { authFirebase } from '../../assets/js/auth';
import { companyLogged } from '../../assets/js/companyLogged';
import { navigateTo } from '../../assets/js/navigation';

init();

function init() {
  showCompanies();
}

function showCompanies() {
  if (!authFirebase || !authFirebase.isLogged()) {
    console.warn('usuário não autenticado...');
    return;
  }

  const container = clearElement(document.getElementById('divContainer'));

  if (!authFirebase.userLogged.companies || authFirebase.userLogged.companies.length === 0) {
    const divRow = document.createElement('div');
    divRow.className = 'row';
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
    spanTitle.innerText = 'Você ainda não está vinculado a nenhuma empresa';
    divCardContent.appendChild(spanTitle);

    return;
  }

  function clearElement(el) {
    el.querySelectorAll('*').forEach(n => n.remove());
    el.innerHTML = '';
    return el;
  }

  authFirebase.userLogged.companies.forEach(e => {
    const divRow = document.createElement('div');
    divRow.className = 'row';
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
    spanTitle.innerText = mascaraCnpj(e.empresaid);
    divCardContent.appendChild(spanTitle);

    const txtRazao = document.createElement('p');
    txtRazao.innerText = e.razaosocial;
    divCardContent.appendChild(txtRazao);

    const divCardAction = document.createElement('div');
    divCardAction.className = 'card-action white center';
    divCard.appendChild(divCardAction);

    const btnSelecionar = document.createElement('a');
    btnSelecionar.className = 'black-text';
    btnSelecionar.innerText = 'Selecionar';
    btnSelecionar.onclick = selectCompany;
    btnSelecionar.company = e;
    divCardAction.appendChild(btnSelecionar);
  });
}

function selectCompany(el) {
  companyLogged.setCompany(el.target.company);
  navigateTo('/home');
}

function mascaraCnpj(valor) {
  return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
}
