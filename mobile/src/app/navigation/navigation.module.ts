import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NavigationRoutingModule } from './navigation-routing.module';

import { NavigationPage } from './navigation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavigationRoutingModule
  ],
  declarations: [NavigationPage]
})
export class NavigationModule {}
