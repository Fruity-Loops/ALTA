import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/components/home/home.component';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardComponent } from 'src/app/components/dashboard/dashboard.component';
import { SideNavComponent } from 'src/app/components/sidenav/sidenav.component';
import { MatModule } from '../material/material-module';
import { ManageMembersComponent } from 'src/app/components/manage-members/manage-members.component';
import { ModifyMembersComponent } from 'src/app/components/modify-members/modify-members.component';
import { ToolbarComponent } from 'src/app/components/toolbar/toolbar.component';

@NgModule({
  declarations: [
    HomeComponent,
    ToolbarComponent,
    DashboardComponent,
    SideNavComponent,
    ManageMembersComponent,
    ModifyMembersComponent],
  imports: [
    CommonModule,
    MatModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [AuthService, Router],
})
export class AltaMainModule { }
