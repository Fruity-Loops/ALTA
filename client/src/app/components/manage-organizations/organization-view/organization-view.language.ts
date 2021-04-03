import {Language} from '../../../services/Language';

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

export class OrganizationViewLangFactory {
  lang: OrganizationViewLanguage;
  constructor(language: Language) {
    if (language === Language.ENGLISH) {
      this.lang = new OrganizationViewEnglish();
    } else {
      this.lang = new OrganizationViewEnglish();
    }
  }
}
