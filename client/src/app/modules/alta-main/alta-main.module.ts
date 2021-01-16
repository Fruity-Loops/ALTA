import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {HomeComponent} from 'src/app/components/home/home.component';
import {AuthService} from 'src/app/services/auth.service';
import {DashboardComponent} from 'src/app/components/dashboard/dashboard.component';
import {SideNavComponent} from 'src/app/components/sidenav/sidenav.component';
import {MatModule} from '../material/material-module';
import {ToolbarComponent} from 'src/app/components/toolbar/toolbar.component';
import {AuthModule} from '../auth/auth.module';
import {ClientGridviewComponent} from 'src/app/components/client-gridview/client-gridview.component';
import {
  ManageOrganizationsComponent,
  OrganizationDialogComponent,
} from 'src/app/components/manage-organizations/manage-organizations.component';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { FormsModule } from '@angular/forms';
import { EmployeeSettingsComponent } from '../../components/employee-settings/employee-settings.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { ManageInventoryItemsComponent } from '../../components/manage-inventory-items/manage-inventory-items.component';
import { CreateAuditTemplateComponent } from '../../components/audit-template/create-audit-template/create-audit-template.component';
import { EditAuditTemplateComponent } from '../../components/audit-template/edit-audit-template/edit-audit-template.component';
import { AuditTemplateComponent, DeleteTemplateDialogComponent } from '../../components/audit-template/audit-template.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MAT_DATE_LOCALE, MatChipsModule, MatDatepickerModule, MatNativeDateModule} from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import {CreateOrganizationComponent} from '../../components/manage-organizations/create-organization/create-organization.component';
import {
  DisableOrganizationDialogComponent,
  EditOrganizationComponent
} from '../../components/manage-organizations/create-organization/edit-organization.component';

@NgModule({
  declarations: [
    HomeComponent,
    ToolbarComponent,
    DashboardComponent,
    SideNavComponent,
    ClientGridviewComponent,
    ManageOrganizationsComponent,
    EmployeeSettingsComponent,
    OrganizationDialogComponent,
    ManageInventoryItemsComponent,
    CreateAuditTemplateComponent,
    DeleteTemplateDialogComponent,
    AuditTemplateComponent,
    EditAuditTemplateComponent,
    CreateOrganizationComponent,
    EditOrganizationComponent,
    DisableOrganizationDialogComponent
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
    ],
  providers: [AuthService, ManageMembersService, ManageOrganizationsComponent, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'} ],
})
export class AltaMainModule {
}
