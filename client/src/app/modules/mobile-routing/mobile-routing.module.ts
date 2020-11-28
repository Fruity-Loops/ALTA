import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { MobileHomeComponent } from 'src/app/mobile-components/mobile-home/mobile-home.component';


const routes: Routes = [
  {
    path: 'mobile-home',
    component: MobileHomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: MobileHomeComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class MobileRoutingModule {}
