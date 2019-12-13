class CompanyLogged {
  constructor() {
    const company = localStorage.getItem('companySelected');
    if (company) {
      this.company = JSON.parse(company);
    }
  }

  isSelected() {
    return this.company && window.companyLogged;
  }

  setCompany(company) {
    this.company = company;
    localStorage.setItem('companySelected', JSON.stringify(this.company));
  }
}

function createInstance() {
  if (!window.companyLogged) {
    window.companyLogged = new CompanyLogged();
  }
  return window.companyLogged;
}

export let companyLogged = createInstance();
