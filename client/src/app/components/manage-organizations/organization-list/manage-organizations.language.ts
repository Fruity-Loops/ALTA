import {ComponentLang, LangFactory} from '../../../services/Language';

export interface ManageOrganizationTableHeaders {
  company_name: string;
  activated_on: string;
  status: string;
  address: string;
  settings: string;
}

interface ManageOrganizationsLanguage {
  title: string;
  searchPlaceholder: string;
  tableHeaders: ManageOrganizationTableHeaders;
  addButton: string;
}

class ManageOrganizationsEnglish implements  ManageOrganizationsLanguage {
  title: string;
  searchPlaceholder: string;
  tableHeaders: ManageOrganizationTableHeaders;
  addButton: string;
  constructor() {
    this.title = 'Organizations';
    this.searchPlaceholder = 'Search Organizations';
    this.tableHeaders = {company_name: 'Company Name', activated_on: 'Activated On', status: 'Status', address: 'Address', settings: 'Settings'};
    this.addButton = 'Add';
  }
}

export class ManageOrganizationsLangFactory extends LangFactory {
  lang: ManageOrganizationsLanguage;
  constructor() {
    super();
    this.lang = this.getComponentLang() as ManageOrganizationsLanguage;
  }

  getEnglish(): ComponentLang {
    return new ManageOrganizationsEnglish();
  }
}
