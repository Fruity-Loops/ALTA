import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SidenavPage } from './sidenav.page';

const routes: Routes = [
  {
    path: '',
    component: SidenavPage,
    children: [
      {
        path: 'audits',
        loadChildren: () => import('../pages/audits/audits.module').then(m => m.AuditsModule)
      },
      {
        path: 'audits/:audit_id',
        loadChildren: () => import('../pages/audits/bins/bins.module').then(m => m.BinsModule)
      },
      {
        path: 'audits/:audit_id/:bin_id',
        loadChildren: () => import('../pages/audits/items/items.module').then(m => m.ItemsModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: '',
        redirectTo: 'audits',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SidenavPageRoutingModule {}
