import {Language} from '../../services/Language';

export interface ManageStockKeepersDesignationActionButtons {
  expand: string;
  collapse: string;
  back: string;
  discard: string;
  assign: string;
  cancel: string;
  auto_assign: string;
}

interface ManageStockKeepersDesignationLanguage {
  title: string;
  binsTitle: string;
  actionButtons: ManageStockKeepersDesignationActionButtons;
}

class ManageStockKeepersDesignationEnglish implements ManageStockKeepersDesignationLanguage {
  title: string;
  binsTitle: string;
  actionButtons: ManageStockKeepersDesignationActionButtons;
  constructor() {
    this.title = 'Designate Bins to Stock-Keepers';
    this.binsTitle = 'Bins';
    this.actionButtons = {
      expand: 'Expand All', collapse: 'Collapse All', back: 'Go Back', discard: 'Discard', assign: 'Assign', cancel: 'Cancel',
      auto_assign: 'Auto Assign'
    };
  }
}

export class ManageStockKeepersDesignationLangFactory {
  lang: ManageStockKeepersDesignationLanguage;
  constructor(language: Language) {
    if (language === Language.ENGLISH) {
      this.lang = new ManageStockKeepersDesignationEnglish();
    } else {
      this.lang = new ManageStockKeepersDesignationEnglish();
    }
  }
}

