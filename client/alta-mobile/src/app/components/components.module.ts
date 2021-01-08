import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
    declarations: [
        ToolbarComponent,
    ],
    imports: [IonicModule],
    exports: [
        ToolbarComponent,
    ]
})

export class ComponentsModule{}
