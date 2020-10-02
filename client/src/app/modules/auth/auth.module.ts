import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthTabsComponent } from '../../components/auth-tabs/auth-tabs.component';

@NgModule({
  declarations: [AuthTabsComponent],
  imports: [CommonModule],
  exports: [AuthTabsComponent],
})
export class AuthModule {}
