import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ItemsRoutingModule } from './items-routing.module';
import { ItemsPage } from './items.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsRoutingModule,
    ComponentsModule,
  ],
  declarations: [ItemsPage]
})
export class ItemsModule {}
