import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { fetchLoggedInUser } from 'src/app/services/cache';
import { AuditService } from 'src/app/services/audit.service';

@Component({
  selector: 'app-notification-popover-menu',
  templateUrl: './notification-popover-menu.component.html',
  styleUrls: ['./notification-popover-menu.component.scss'],
  providers: [NavParams],
})
export class NotificationPopoverMenuComponent implements OnInit {
  notificationData: any;

  constructor(
    private auditService: AuditService,
    private router: Router,
    public navParams: NavParams,
    private popoverController: PopoverController,
  ) {
    this.notificationData = this.navParams.get('notificationData');
  }

  ngOnInit() { }

  async dismissPopover() {
    await this.popoverController.dismiss();
  }

  handleNotificationClick() {
    this.dismissPopover();
    this.router.navigateByUrl(`/audits`, { replaceUrl: false });
  }
}
