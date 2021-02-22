import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {HomeComponent} from 'src/app/components/home/home.component';
import {AuthService} from 'src/app/services/authentication/auth.service';
import {DashboardComponent} from 'src/app/components/dashboard/dashboard.component';
import {SideNavComponent} from 'src/app/components/sidenav/sidenav.component';
import {MatModule} from '../material/material-module';
import {ToolbarComponent} from 'src/app/components/toolbar/toolbar.component';
import {AuthModule} from '../auth/auth.module';
import {EmployeeListComponent} from 'src/app/components/employees/employee-list/employee-list.component';
import {
  ManageOrganizationsComponent,
} from 'src/app/components/manage-organizations/organization-list/manage-organizations.component';
import { ManageMembersService } from 'src/app/services/users/manage-members.service';
import { FormsModule } from '@angular/forms';
import { EditEmployeeComponent } from '../../components/employees/employee-view/edit-employee/edit-employee.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { ManageInventoryItemsComponent } from '../../components/manage-inventory-items/manage-inventory-items.component';
import { CreateAuditTemplateComponent } from '../../components/audit-template/audit-template-view/create-audit-template/create-audit-template.component';
import { EditAuditTemplateComponent } from '../../components/audit-template/audit-template-view/edit-audit-template/edit-audit-template.component';
import { AuditTemplateComponent, DeleteTemplateDialogComponent } from '../../components/audit-template/audit-template-list/audit-template.component';
import { AssignStockKeepersComponent } from '../../components/assign-stock-keepers/assign-stock-keepers.component';
import { ManageStockKeepersDesignationComponent } from '../../components/manage-stock-keepers-designation/manage-stock-keepers-designation.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MAT_DATE_LOCALE, MatChipsModule, MatDatepickerModule, MatNativeDateModule, MatSortModule} from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import {CreateOrganizationComponent} from '../../components/manage-organizations/organization-view/create-organization/create-organization.component';
import {
  DisableOrganizationDialogComponent,
  EditOrganizationComponent
} from '../../components/manage-organizations/organization-view/edit-organization/edit-organization.component';
import { ReviewAuditComponent } from 'src/app/components/review-audit/review-audit.component';
import { ManageAuditsComponent } from 'src/app/components/manage-audits/manage-audits.component';


@NgModule({
  declarations: [
    HomeComponent,
    ToolbarComponent,
    DashboardComponent,
    SideNavComponent,
    EmployeeListComponent,
    ManageOrganizationsComponent,
    EditEmployeeComponent,
    ManageInventoryItemsComponent,
    CreateAuditTemplateComponent,
    DeleteTemplateDialogComponent,
    AuditTemplateComponent,
    EditAuditTemplateComponent,
    CreateOrganizationComponent,
    EditOrganizationComponent,
    DisableOrganizationDialogComponent,
    AssignStockKeepersComponent,
    ManageStockKeepersDesignationComponent,
    ReviewAuditComponent,
    ManageAuditsComponent
  ],

  imports: [
    CommonModule,
    MatModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AuthModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatExpansionModule,
    MatSortModule,
  ],
  providers: [AuthService, ManageMembersService, ManageOrganizationsComponent, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'} ],
})
export class AltaMainModule {
}
