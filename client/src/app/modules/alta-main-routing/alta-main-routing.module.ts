import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthTabsComponent } from 'src/app/components/auth-tabs/auth-tabs.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: AuthTabsComponent },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard], // If user has a valid token he will be able to access comment page
    children: [
      {
        path: '',  // Empty path needed in child too to be able to force a redirect
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      { path: 'dashboard', component: DashboardComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AltaMainRoutingModule { }
