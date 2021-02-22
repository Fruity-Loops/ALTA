import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignInRoutingModule } from './signin-routing.module';

import { SigninPage } from './signin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignInRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SigninPage]
})
export class SigninPageModule {}
