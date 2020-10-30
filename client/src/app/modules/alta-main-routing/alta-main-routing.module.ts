import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GreetingComponent } from 'src/app/components/greeting/greeting.component';
import { CreateMembersComponent } from 'src/app/components/create-members/create-members.component';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { ManageOrganizationsComponent } from 'src/app/components/manage-organizations/manage-organizations.component';
import { ModifyMembersComponent } from 'src/app/components/modify-members/modify-members.component';
import { AuthGuard } from '../../guards/auth.guard';
import {EmployeeSettingsComponent} from "../../components/employee-settings/employee-settings.component";

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
      { path: 'modify-members', component: ModifyMembersComponent },
      {path: 'manage-organizations', component: ManageOrganizationsComponent},
      {path: 'modify-members/:ID', component: EmployeeSettingsComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AltaMainRoutingModule { }
