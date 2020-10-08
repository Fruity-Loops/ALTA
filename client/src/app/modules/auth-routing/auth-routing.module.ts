import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthTabsComponent } from 'src/app/components/auth-tabs/auth-tabs.component';

const routes: Routes = [
  {
    path: '', // Default route
    component: AuthTabsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
