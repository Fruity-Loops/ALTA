import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GreetingComponent } from 'src/app/components/greeting/greeting.component';

const routes: Routes = [
  {
    path: 'login',
    component: GreetingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
