import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [],
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
  ],
  providers: [],
  exports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
  ]
})
export class MatModule { }
