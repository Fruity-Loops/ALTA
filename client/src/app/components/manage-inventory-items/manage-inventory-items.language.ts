import {Language} from '../../services/Language';

interface ManageInventoryItemsLanguage {
  title: string;
  searchPlaceholder: string;
  startAuditBtn: string;
}

class ManageInventoryItemsEnglish implements ManageInventoryItemsLanguage{
  title: string;
  searchPlaceholder: string;
  startAuditBtn: string;
  constructor() {
    this.title = 'Inventory Items';
    this.searchPlaceholder = 'Search...';
    this.startAuditBtn = 'Start Audit';
  }
}

export class ManageInventoryItemsLangFactory {
  lang: ManageInventoryItemsLanguage;
  constructor(language: Language) {
    if (language === Language.ENGLISH) {
      this.lang = new ManageInventoryItemsEnglish();
    } else {
      this.lang = new ManageInventoryItemsEnglish();
    }
  }
}
