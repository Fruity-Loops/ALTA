import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthTabsComponent } from 'src/app/components/auth-tabs/auth-tabs.component';
import { CreateMembersComponent } from 'src/app/components/create-members/create-members.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { ModifyMembersComponent } from 'src/app/components/modify-members/modify-members.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
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
      { path: 'create-members', component: CreateMembersComponent },
      { path: 'modify-members', component: ModifyMembersComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AltaMainRoutingModule { }
