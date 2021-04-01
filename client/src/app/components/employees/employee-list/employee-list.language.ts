import {Language} from '../../../services/Language';

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

export class EmployeeListLangFactory {
  lang: EmployeeListLanguage;

  constructor(language: Language) {
     if (language === Language.ENGLISH) {
       this.lang = new EmployeeListEnglish();
     } else {
       this.lang = new EmployeeListEnglish();
     }
  }
}
