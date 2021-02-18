import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GreetingComponent} from '../../components/greeting/greeting.component';
import {LoginComponent} from 'src/app/components/login/login.component';
import {CreateEmployeeComponent} from 'src/app/components/employees/employee-view/create-employee/create-employee.component';
import {AuthService} from 'src/app/services/authentication/auth.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {MatModule} from '../material/material-module';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [GreetingComponent, LoginComponent, CreateEmployeeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatModule,
    FlexModule,
  ],
  exports: [GreetingComponent, LoginComponent, CreateEmployeeComponent],
  providers: [AuthService],
})
export class AuthModule {
}
