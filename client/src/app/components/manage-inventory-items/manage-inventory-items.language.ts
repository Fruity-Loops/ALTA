import {LangFactory} from '../../services/Language';

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

export class ManageInventoryItemsLangFactory extends LangFactory {
  lang: ManageInventoryItemsLanguage;
  constructor() {
    super();
    this.lang = this.getComponentLang() as ManageInventoryItemsLanguage;
  }

  getEnglish(): ManageInventoryItemsLanguage {
    return new ManageInventoryItemsEnglish();
  }
}
