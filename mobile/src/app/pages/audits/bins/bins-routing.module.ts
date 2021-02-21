import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BinsPage } from './bins.page';

const routes: Routes = [
  {
    path: '',
    component: BinsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BinsRoutingModule {}
