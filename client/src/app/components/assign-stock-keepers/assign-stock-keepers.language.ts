import {LangFactory} from '../../services/Language';

export interface SKTable {
  select: string;
  first_name: string;
  last_name: string;
  availability: string;
}

export interface ActionButtons {
  expand: string;
  collapse: string;
  back: string;
  discard: string;
  assign: string;
  cancel: string;
}

export interface AssignStockKeepersLanguage {
  title: string;
  skTable: SKTable;
  actionButtons: ActionButtons;
}

class AssignStockKeepersEnglish implements AssignStockKeepersLanguage {
  title: string;
  skTable: SKTable;
  actionButtons: ActionButtons;

  constructor() {
    this.title = 'Select Stock-Keepers';
    this.skTable = {
      select: 'Select', first_name: 'First Name', last_name: 'Last Name', availability: 'Availability'
    };
    this.actionButtons = {
      expand: 'Expand All', collapse: 'Collapse All', back: 'Go Back', discard: 'Discard', assign: 'Assign', cancel: 'Cancel'
    };
  }
}

export class AssignStockKeepersLangFactory extends LangFactory {
  lang: AssignStockKeepersLanguage;
  constructor() {
    super();
    this.lang = this.getComponentLang() as AssignStockKeepersLanguage;
  }

  getEnglish(): AssignStockKeepersLanguage {
    return new AssignStockKeepersEnglish();
  }
}
