import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.page.html',
  styleUrls: ['./sidenav.page.scss'],
})
export class SidenavPage implements OnInit {
  sideNav = 'sideNavId'

  constructor(private menu: MenuController) { }

  ngOnInit() {
  }

  open() {
    this.menu.enable(true, this.sideNav);
    this.menu.open(this.sideNav);
  }

  close() {
    this.menu.close();
  }

}
