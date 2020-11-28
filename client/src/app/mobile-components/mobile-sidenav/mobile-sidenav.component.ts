import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-mobile-sidenav',
  templateUrl: './mobile-sidenav.component.html',
  styleUrls: ['./mobile-sidenav.component.scss']
})
export class MobileSidenavComponent {

  constructor(private menu: MenuController) { }

  open(): void {
    this.menu.enable(true, 'mobile-sidnav-id');
    this.menu.open('mobile-sidnav-id');
  }
}
