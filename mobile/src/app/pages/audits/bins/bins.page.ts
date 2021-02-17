import { Component, OnInit } from '@angular/core';
import { AuditService } from 'src/app/services/audit.service';
import { ActivatedRoute } from '@angular/router';
import { fetchLoggedInUser } from 'src/app/services/cache';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-bins',
  templateUrl: './bins.page.html',
  styleUrls: ['./bins.page.scss'],
})
export class BinsPage implements OnInit {
  auditID: string;
  bins: Array<any>;
  loggedInUser: any;
  blankMessage: string;
  refreshEvent: any;

  constructor(
    private auditService: AuditService,
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.getSelectedAudit();
    this.getBins();
  }

  getSelectedAudit() {
    this.auditID = this.activatedRoute.snapshot.paramMap.get('audit_id');
  }

  async getBins() {
    const whileLoading = await this.loadingController.create({
      message: 'Fetching Bins...'
    });
    if (!this.refreshEvent) {
      await whileLoading.present();
    }

    fetchLoggedInUser().then(
      user => {
        if (user) {
          this.loggedInUser = user;
          this.auditService.getBins(user.user_id, this.auditID).subscribe(
            async (res) => {
              await whileLoading.dismiss();
              this.bins = res;
              this.blankMessage = 'No Bins are currently set for this Audit.';
              this.completeRefresh();
            },
            async (res) => {
              this.blankMessage = `There was a problem trying to fetch the bins for Audit ${this.auditID}.`;
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
    this.getBins();
  }

  async completeRefresh() {
    if (this.refreshEvent) {
      this.refreshEvent.target.complete();
      this.refreshEvent = null;
    }
  }

  displayProgression(event) {
    event.preventDefault();
    event.stopPropagation();
 }
}
