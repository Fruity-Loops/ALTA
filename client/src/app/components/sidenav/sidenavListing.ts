import { SideNavOption } from './sidenavOption';

// These are the menu options listed that can be chosen from the sidenav menu
export const SideNavListings: SideNavOption[] = [
  { title: 'Dashboard', routerLink: 'dashboard', subMenuOptions: [] },
  { title: 'Audits', routerLink: 'audits', subMenuOptions: [] },
  {
    title: 'Template', routerLink: 'template', subMenuOptions: [
      { title: 'Search Template', routerLink: 'search-template', subMenuOptions: [] },
      { title: 'Create Template', routerLink: 'create-template', subMenuOptions: [] },
    ]
  },
  {
    title: 'Manage Members', routerLink: 'manage-members', subMenuOptions: [
      { title: 'Create Members', routerLink: 'create-members', subMenuOptions: [] },
      { title: 'Modify Members', routerLink: 'modify-members', subMenuOptions: [] },
    ]
  },
  { title: 'Manage Organizations', routerLink: 'manage-organizations', subMenuOptions: [] }
];
