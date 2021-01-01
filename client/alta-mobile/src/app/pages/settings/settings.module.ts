import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from 'src/app/components/components.module';
import { SettingsPage } from './settings.page';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsRoutingModule,
    ComponentsModule
  ],
  declarations: [SettingsPage]
})
export class SettingsModule {}
