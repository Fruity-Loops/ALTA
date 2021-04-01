import {Language} from '../../../services/Language';

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

export class AuditTemplateListLangFactory {
  lang: AuditTemplateListLanguage;
  constructor(language: Language) {
    if (language === Language.ENGLISH) {
      this.lang = new AuditTemplateListEnglish();
    } else {
      this.lang = new AuditTemplateListEnglish();
    }
  }
}
