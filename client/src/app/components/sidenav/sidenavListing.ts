import { SideNavOption } from './sidenavOption';

const loggedInUser = localStorage.getItem('id');
let settings: SideNavOption = {
  title: 'Settings',
  routerLink: 'modify-members/' + loggedInUser,
  subMenuOptions: [],
}

// These are the menu options listed that can be chosen from the sidenav menu
export const SystemNavListings: SideNavOption[] = [
  {
    title: 'Manage Organizations',
    routerLink: 'manage-organizations',
    subMenuOptions: [],
  },
  {
    title: 'Manage Members',
    routerLink: 'modify-members',
    subMenuOptions: [],
  },
  settings
];

export const OrganizationNavListings: SideNavOption[] = [
  { title: 'Dashboard', routerLink: 'dashboard', subMenuOptions: [] },
  { title: 'Audits', routerLink: 'audits', subMenuOptions: [] },
  {
    title: 'Template',
    routerLink: 'template',
    subMenuOptions: [
      {
        title: 'Search Template',
        routerLink: 'search-template',
        subMenuOptions: [],
      },
      {
        title: 'Create Template',
        routerLink: 'create-template',
        subMenuOptions: [],
      },
    ],
  },
  {
    title: 'Employees',
    routerLink: 'modify-members',
    subMenuOptions: [],
  },
  settings
];
