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

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    SideNavComponent],
  imports: [
    CommonModule,
    MatModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [AuthService],
})
export class AltaMainModule { }
