import {Language} from '../../../services/Language';

export interface EmployeeViewPlaceHolders {
  first_name: string;
  email: string;
  last_name: string;
  employee_id: string;
  password: string;
  location: string;
}

export interface EmployeeViewLabels {
  first_name: string;
  email: string;
  last_name: string;
  employee_id: string;
  role: string;
  is_active: string;
  password: string;
  location: string;
}

export interface EmployeeViewActionLabels {
  save: string;
  edit: string;
  cancel: string;
}

export interface EmployeeViewLanguage {
  fieldLabels: EmployeeViewLabels;
  fieldPlaceholders: EmployeeViewPlaceHolders;
  actionLabels: EmployeeViewActionLabels;
}

export class EmployeeViewLangFactory {
  lang: EmployeeViewLanguage;

  constructor(language: Language) {
    if (language === Language.ENGLISH) {
      this.lang = new EmployeeViewEnglish();
    } else {
      this.lang = new EmployeeViewEnglish();
    }
  }
}

class EmployeeViewEnglish implements EmployeeViewLanguage {
  fieldLabels: EmployeeViewLabels;
  fieldPlaceholders: EmployeeViewPlaceHolders;
  actionLabels: EmployeeViewActionLabels;

  constructor() {
    this.fieldLabels = {first_name: 'First Name', email: 'E-mail Address', last_name: 'Last Name', employee_id: 'Employee ID', role: 'Role',
      is_active: 'Is Active', password: 'Password', location: 'Employment Location'};
    this.fieldPlaceholders = {first_name: 'First name', email: 'E-mail address', last_name: 'Last name', employee_id: 'Employee ID',
      password: 'Password', location: 'Employment Location'};
    this.actionLabels = {save: 'Save', edit: 'Edit', cancel: 'Cancel'};
  }
}
