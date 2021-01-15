import {SideNavOption} from './sidenavOption';

// TODO: settings is unused, should it be deleted?
// @ts-ignore
const settings: SideNavOption = {
  title: 'Settings',
  routerLink: 'settings',
  subMenuOptions: [],
};

// These are the menu options listed that can be chosen from the sidenav menu
export const SystemNavListings: SideNavOption[] = [
  {
    title: 'Manage Organizations',
    routerLink: 'manage-organizations',
    subMenuOptions: [],
  },
  {
    title: 'Manage Members',
    routerLink: 'sa-modify-members',
    subMenuOptions: [],
  },
  {
    title: 'Settings',
    routerLink: 'sa-settings',
    subMenuOptions: [],
  },
];

export const OrganizationNavListings: SideNavOption[] = [
  {title: 'Dashboard', routerLink: 'dashboard', subMenuOptions: []},
  {title: 'Audits', routerLink: 'audits', subMenuOptions: []},
  {
    title: 'Template',
    routerLink: 'template',
    subMenuOptions: [],
  },
  {
    title: 'Employees',
    routerLink: 'modify-members',
    subMenuOptions: [],
  },
  {
    title: 'Inventory Items',
    routerLink: 'manage-items',
    subMenuOptions: [],
  },
  {
    title: 'Settings',
    routerLink: 'settings',
    subMenuOptions: [],
  },
];
