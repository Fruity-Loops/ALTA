import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { AuditsRoutingModule } from './audits-routing.module';
import { AuditsPage } from './audits.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuditsRoutingModule,
    ComponentsModule,
  ],
  declarations: [AuditsPage]
})
export class AuditsModule {}
