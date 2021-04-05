import {SideNavOption} from './sidenavOption';
import {SideNavLangFactory} from './sidenav.language';

const lang = new SideNavLangFactory();

// These are the menu options listed that can be chosen from the sidenav menu
export const SystemNavListings: SideNavOption[] = [
  {
    title: lang.lang.SystemNavTitles.manageOrgs,
    routerLink: 'manage-organizations',
    subMenuOptions: [],
  },
  {
    title: lang.lang.SystemNavTitles.manageMembers,
    routerLink: 'sa-modify-members',
    subMenuOptions: [],
  },
  {
    title: lang.lang.SystemNavTitles.settings,
    routerLink: 'sa-settings',
    subMenuOptions: [],
  },
];

export const OrganizationNavListings: SideNavOption[] = [
  {title: lang.lang.OrganizationNavTitles.dashboard, routerLink: 'dashboard', subMenuOptions: []},
  {title: lang.lang.OrganizationNavTitles.audits, routerLink: 'audits', subMenuOptions: []},
  {
    title: lang.lang.OrganizationNavTitles.template,
    routerLink: 'template',
    subMenuOptions: [],
  },
  {
    title: lang.lang.OrganizationNavTitles.employees,
    routerLink: 'modify-members',
    subMenuOptions: [],
  },
  {
    title: lang.lang.OrganizationNavTitles.invItems,
    routerLink: 'manage-items',
    subMenuOptions: [],
  },
  {
    title: lang.lang.OrganizationNavTitles.settings,
    routerLink: 'settings',
    subMenuOptions: [],
  },
  {
    title: lang.lang.OrganizationNavTitles.orgSettings,
    routerLink: 'organization-settings',
    subMenuOptions: [],
  }
];
