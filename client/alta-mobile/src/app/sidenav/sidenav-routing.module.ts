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
        loadChildren: () => import('../page1/page1.module').then(m => m.Page1PageModule)
      },
      {
        path: 'page2',
        loadChildren: () => import('../page2/page2.module').then(m => m.Page2PageModule)
      },
      {
        path: 'page3',
        loadChildren: () => import('../page3/page3.module').then(m => m.Page3PageModule)
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
