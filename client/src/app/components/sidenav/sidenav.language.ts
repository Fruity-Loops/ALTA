import {Language} from '../../services/Language';

export interface SideNavSysTitles {
  manageOrgs: string;
  manageMembers: string;
  settings: string;
}

export interface SideNavOrgTitles {
  dashboard: string;
  audits: string;
  template: string;
  employees: string;
  invItems: string;
  settings: string;
  orgSettings: string;
}

interface SidenavLanguage {
  SystemNavTitles: SideNavSysTitles;
  OrganizationNavTitles: SideNavOrgTitles;
}

class SidenavEnglish implements SidenavLanguage {
  SystemNavTitles: SideNavSysTitles;
  OrganizationNavTitles: SideNavOrgTitles;
  constructor() {
    this.SystemNavTitles = {manageOrgs: 'Manage Organizations', manageMembers: 'Manage Members', settings: 'Settings'};
    this.OrganizationNavTitles = {dashboard: 'Dashboard', audits: 'Audits', template: 'Templates', employees: 'Employees',
      invItems: 'Inventory Items', settings: 'Settings', orgSettings: 'Organization Settings'};
  }
}

export class SideNavLangFactory {
  lang: SidenavLanguage;
  constructor(language: Language) {
    if (language === Language.ENGLISH) {
      this.lang = new SidenavEnglish();
    } else {
      this.lang = new SidenavEnglish();
    }
  }
}

