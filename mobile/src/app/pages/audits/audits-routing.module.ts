import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditsPage } from './audits.page';

const routes: Routes = [
  {
    path: '',
    component: AuditsPage
  },
  {
    path: 'bins',
    loadChildren: () => import('./bins/bins.module').then( m => m.BinsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditsRoutingModule {}
