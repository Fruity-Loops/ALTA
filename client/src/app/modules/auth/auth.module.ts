import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GreetingComponent } from '../../components/greeting/greeting.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { SignupComponent } from 'src/app/components/signup/signup.component';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatModule } from '../material/material-module';
import {FlexModule} from '@angular/flex-layout';
@NgModule({
  declarations: [GreetingComponent, LoginComponent, SignupComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        MatModule,
        FlexModule,
    ],
  exports: [GreetingComponent, LoginComponent, SignupComponent],
  providers: [AuthService],
})
export class AuthModule {}
