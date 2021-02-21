import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { BinsRoutingModule } from './bins-routing.module';
import { BinsPage } from './bins.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BinsRoutingModule,
    ComponentsModule,
  ],
  declarations: [BinsPage]
})
export class BinsModule {}
