import {LangFactory, Language} from '../../../services/Language';

export interface OrgViewLabels {
  name: string;
  location: string;
  or: string;
  status: string;
}

export interface OrgViewPlaceholders {
  org_name: string;
  location: string;
}

export interface OrgViewActionButtons {
  save: string;
  edit: string;
  cancel: string;
}

interface OrganizationViewLanguage {
  fieldLabels: OrgViewLabels;
  fieldPlaceholders: OrgViewPlaceholders;
  actionButtons: OrgViewActionButtons;
}

class OrganizationViewEnglish implements OrganizationViewLanguage {
  fieldLabels: OrgViewLabels;
  fieldPlaceholders: OrgViewPlaceholders;
  actionButtons: OrgViewActionButtons;

  constructor() {
    this.fieldLabels = {name: 'Name', location: 'Location', or: 'OR', status: 'Status'};
    this.fieldPlaceholders = {org_name: 'Organization Name', location: 'Location Code,Location Description'};
    this.actionButtons = {save: 'SAVE', edit: 'EDIT', cancel: 'CANCEL'};
  }
}

export class OrganizationViewLangFactory extends LangFactory {
  lang: OrganizationViewLanguage;
  constructor(language: Language) {
    super(language);
    this.lang = this.getComponentLang() as OrganizationViewLanguage;
  }

  getEnglish(): OrganizationViewLanguage {
    return new OrganizationViewEnglish();
  }
}
