import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SidenavPage } from './sidenav.page';

const routes: Routes = [
  {
    path: '',
    component: SidenavPage,
    children: [
      {
        path: 'page1',
        loadChildren: () => import('../pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'page2',
        loadChildren: () => import('../pages/audits/audits.module').then(m => m.AuditsModule)
      },
      {
        path: 'page3',
        loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: '',
        redirectTo: 'page1',
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
