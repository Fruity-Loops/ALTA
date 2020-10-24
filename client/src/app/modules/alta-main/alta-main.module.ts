import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/components/home/home.component';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { SideNavComponent } from 'src/app/components/sidenav/sidenav.component';
import { MatModule } from '../material/material-module';
import { ManageMembersComponent } from 'src/app/components/manage-members/manage-members.component';
import { ModifyMembersComponent } from 'src/app/components/modify-members/modify-members.component';
import { ToolbarComponent } from 'src/app/components/toolbar/toolbar.component';
import { CreateMembersComponent } from 'src/app/components/create-members/create-members.component';
import { AuthModule } from '../auth/auth.module';
import { ClientGridviewComponent } from 'src/app/components/client-gridview/client-gridview.component';
import { ManageOrganizationsComponent } from 'src/app/components/manage-organizations/manage-organizations.component';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    ToolbarComponent,
    DashboardComponent,
    SideNavComponent,
    ManageMembersComponent,
    ModifyMembersComponent,
    ClientGridviewComponent,
    CreateMembersComponent,
    ManageOrganizationsComponent
  ],

  imports: [
    CommonModule,
    MatModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AuthModule,
    FormsModule,
  ],
  providers: [AuthService, ManageMembersService, ManageOrganizationsComponent],

})
export class AltaMainModule { }
