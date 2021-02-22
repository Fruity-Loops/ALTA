import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { ManageOrganizationsComponent } from 'src/app/components/manage-organizations/organization-list/manage-organizations.component';
import { AuthGuard } from '../../guards/auth.guard';
import { EditEmployeeComponent } from '../../components/employees/employee-view/edit-employee/edit-employee.component';
import { EmployeeListComponent } from '../../components/employees/employee-list/employee-list.component';
import { CreateEmployeeComponent } from '../../components/employees/employee-view/create-employee/create-employee.component';
import { ManageInventoryItemsComponent } from 'src/app/components/manage-inventory-items/manage-inventory-items.component';
import { CreateAuditTemplateComponent } from '../../components/audit-template/audit-template-view/create-audit-template/create-audit-template.component';
import { AuditTemplateComponent } from '../../components/audit-template/audit-template-list/audit-template.component';
import { EditAuditTemplateComponent } from 'src/app/components/audit-template/audit-template-view/edit-audit-template/edit-audit-template.component';
import {CreateOrganizationComponent} from '../../components/manage-organizations/organization-view/create-organization/create-organization.component';
import {EditOrganizationComponent} from '../../components/manage-organizations/organization-view/edit-organization/edit-organization.component';
import { AssignStockKeepersComponent } from 'src/app/components/assign-stock-keepers/assign-stock-keepers.component';
import { ManageStockKeepersDesignationComponent } from 'src/app/components/manage-stock-keepers-designation/manage-stock-keepers-designation.component';
import { ReviewAuditComponent } from 'src/app/components/review-audit/review-audit.component';
import { ManageAuditsComponent } from 'src/app/components/manage-audits/manage-audits.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard], // If user has a valid token he will be able to access comment page
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'create-members', component: CreateEmployeeComponent },
      { path: 'modify-members', component: EmployeeListComponent },
      { path: 'sa-modify-members', component: EmployeeListComponent },
      { path: 'manage-organizations', children: [
          {
            path: '', component: ManageOrganizationsComponent
          },
          {
            path: 'create-organization', component: CreateOrganizationComponent
          },
          {
            path: 'edit-organization/:ID', component: EditOrganizationComponent
          }
        ],
      },
      { path: 'modify-members/:ID', component: EditEmployeeComponent },
      { path: 'settings', component: EditEmployeeComponent },
      { path: 'sa-settings', component: EditEmployeeComponent },
      { path: 'manage-items', component: ManageInventoryItemsComponent },
      { path: 'assign-sk', component: AssignStockKeepersComponent },
      { path: 'designate-sk', component: ManageStockKeepersDesignationComponent },
      { path: 'review-audit', component: ReviewAuditComponent },
      { path: 'audits', children: [
        {
          path: '', component: ManageAuditsComponent
        },
        {
          path: 'assign-sk', children: [
            {
              path: '', component: AssignStockKeepersComponent
            },
            {
              path: 'designate-sk', children: [
                {
                  path: '', component: ManageStockKeepersDesignationComponent
                },
                {
                  path: 'review-audit', component: ReviewAuditComponent
                }
              ]
            }
          ]},
      ]},
      { path: 'template', children: [
          {
            path: '', component: AuditTemplateComponent
          },
          {
            path: 'create-template', component: CreateAuditTemplateComponent
          },
          {
            path: 'edit-template/:ID', component: EditAuditTemplateComponent
          }
        ]},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AltaMainRoutingModule {
}
