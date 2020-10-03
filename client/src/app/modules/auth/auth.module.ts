import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; //Reactive forms provide a model-driven approach to handling form inputs whose values change over tim
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthTabsComponent } from '../../components/auth-tabs/auth-tabs.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { SignupComponent } from 'src/app/components/signup/signup.component';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AuthTabsComponent, LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClient,
  ],
  exports: [AuthTabsComponent, LoginComponent, SignupComponent],
  providers: [AuthService],
})
export class AuthModule {}
