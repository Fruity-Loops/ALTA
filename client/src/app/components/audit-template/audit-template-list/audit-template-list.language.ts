import {LangFactory} from '../../../services/Language';

export interface TemplateOptionLabels {
  edit: string;
  delete: string;
}

export interface AuditTemplateListLanguage {
  title: string;
  searchPlaceholder: string;
  addButton: string;
  optionLabels: TemplateOptionLabels;
}

class AuditTemplateListEnglish implements AuditTemplateListLanguage{
  title: string;
  searchPlaceholder: string;
  addButton: string;
  optionLabels: TemplateOptionLabels;
  constructor() {
    this.title = 'Templates';
    this.searchPlaceholder = 'Search Templates';
    this.addButton = 'Add';
    this.optionLabels = {edit: 'Edit', delete: 'Delete'};
  }
}

export class AuditTemplateListLangFactory extends LangFactory {
  lang: AuditTemplateListLanguage;
  constructor() {
    super();
    this.lang = this.getComponentLang() as AuditTemplateListLanguage;
  }

  getEnglish(): AuditTemplateListLanguage {
    return new AuditTemplateListEnglish();
  }
}
