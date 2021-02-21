import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ItemsRoutingModule } from './items-routing.module';
import { ItemsPage } from './items.page';
import { RecordModule } from 'src/app/pages/audits/items/record/record.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsRoutingModule,
    ComponentsModule,
    RecordModule
  ],
  declarations: [ItemsPage]
})
export class ItemsModule {}
