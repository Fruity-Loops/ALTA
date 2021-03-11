import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { NotificationPopoverMenuComponent } from './toolbar/popovers/notification-popover-menu/notification-popover-menu.component';
import { ProfilePopoverMenuComponent } from './toolbar/popovers/profile-popover-menu/profile-popover-menu.component';

@NgModule({
    declarations: [
        ToolbarComponent,
        NotificationPopoverMenuComponent,
        ProfilePopoverMenuComponent,
    ],
    imports: [
        IonicModule,
        CommonModule
    ],
    exports: [
        ToolbarComponent,
    ]
})

export class ComponentsModule { }
