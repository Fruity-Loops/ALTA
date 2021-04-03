import {ComponentLang, LangFactory} from '../../services/Language';

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

export class ManageStockKeepersDesignationLangFactory extends LangFactory {
  lang: ManageStockKeepersDesignationLanguage;
  constructor() {
    super();
    this.lang = this.getComponentLang() as ManageStockKeepersDesignationLanguage;
  }

  getEnglish(): ComponentLang {
    return new ManageStockKeepersDesignationEnglish();
  }
}

