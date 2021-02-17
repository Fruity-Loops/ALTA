import { Component, OnInit } from '@angular/core';
import { AuditService } from 'src/app/services/audit.service';
import { fetchLoggedInUser } from 'src/app/services/cache';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.page.html',
  styleUrls: ['./audits.page.scss'],
})
export class AuditsPage implements OnInit {
  audits: Array<any>;
  loggedInUser: any;
  blankMessage: string;
  refreshEvent: any;

  constructor(
    private auditService: AuditService,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {
  }

  ngOnInit() {
    this.getAudits();
  }

  async getAudits() {
    const whileLoading = await this.loadingController.create({
      message: 'Fetching Audits...'
    });
    if (!this.refreshEvent) {
      await whileLoading.present();
    }

    fetchLoggedInUser().then(
      user => {
        if (user) {
          this.loggedInUser = user;
          this.auditService.getAudits(user.user_id, user.organization_id).subscribe(
            async (res) => {
              await whileLoading.dismiss();
              this.audits = res;
              this.blankMessage = 'No Audits Currently Pending';
              this.completeRefresh();
            },
            async (res) => {
              this.blankMessage = 'There was a problem trying to fetch audits.';
              await whileLoading.dismiss();
              const alert = await this.alertController.create({
                header: 'Error',
                message: this.blankMessage,
                buttons: ['Dismiss'],
              });
              this.completeRefresh();
              await alert.present();
            });
        }
      });
  }

  async doRefresh(event) {
    this.refreshEvent = event;
    this.getAudits();
  }

  async completeRefresh() {
    if (this.refreshEvent) {
      this.refreshEvent.target.complete();
      this.refreshEvent = null;
    }
  }

}
