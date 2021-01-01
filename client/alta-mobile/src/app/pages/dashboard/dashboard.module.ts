import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { ComponentsModule } from 'src/app/components/components.module';
import { DashboardPage } from './dashboard.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardRoutingModule,
    ComponentsModule,
  ],
  declarations: [DashboardPage]
})
export class DashboardModule {}
