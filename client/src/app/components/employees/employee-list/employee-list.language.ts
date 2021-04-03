import {LangFactory} from '../../../services/Language';

export interface EmployeeListTable {
  first_name: string;
  last_name: string;
  role: string;
  location: string;
  is_active: string;
  settings: string;
}

export interface EmployeeListLanguage {
  title: string;
  searchPlaceholder: string;
  table: EmployeeListTable;
}

class EmployeeListEnglish implements EmployeeListLanguage {
  searchPlaceholder: string;
  table: EmployeeListTable;
  title: string;

  constructor() {
    this.title = 'Employees';
    this.searchPlaceholder = 'Search Employees';
    this.table = {
      first_name: 'First Name', last_name: 'Last Name', role: 'Role', location: 'Location', is_active: 'Status', settings: 'Settings'
    };
  }
}

export class EmployeeListLangFactory extends LangFactory {
  lang: EmployeeListLanguage;

  constructor() {
    super();
    this.lang = this.getComponentLang() as EmployeeListLanguage;
  }

  getEnglish(): EmployeeListLanguage {
    return new EmployeeListEnglish();
  }
}
