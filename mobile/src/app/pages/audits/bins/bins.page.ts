import { Component, OnInit } from '@angular/core';
import { AuditService } from 'src/app/services/audit.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { fetchLoggedInUser } from 'src/app/services/cache';
import { AlertController, LoadingController, PopoverController } from '@ionic/angular';
import { ProgressionMetricsPopoverComponent } from 'src/app/pages/audits/popovers/progression-metrics-popover/progression-metrics-popover.component';

enum Segment {
  BINS = 'bins',
  COMPLETED_BINS = 'completedBins',
}

@Component({
  selector: 'app-bins',
  templateUrl: './bins.page.html',
  styleUrls: ['./bins.page.scss'],
})
export class BinsPage implements OnInit {
  Segment = Segment;
  currentSegment = Segment.BINS;
  auditID: string;
  bins: any;
  completedBins: any;
  loggedInUser: any;
  blankMessage: string;
  refreshEvent: any;

  constructor(
    private auditService: AuditService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController,
    private alertController: AlertController,
    public popoverController: PopoverController,
  ) {
  }

  ngOnInit() {
    this.setSegment();
    this.getSelectedAudit();
    this.getBins();
  }

  setSegment() {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          const state = window.history.state;
          if (state.data?.segment){
            this.currentSegment = state.data?.segment;
          }
        }
      });
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
          this.auditService.getBins(user.user_id, this.auditID, 'Pending').subscribe(
            async (res) => {
              await whileLoading.dismiss();
              this.bins = res;
              this.blankMessage = 'No Bins are currently set for this Audit.';
              this.completeRefresh();
            },
            async (res) => {
              console.log(res);
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

  async getCompletedBins() {
    const whileLoading = await this.loadingController.create({
      message: 'Fetching Completed Bins...'
    });
    if (!this.refreshEvent) {
      await whileLoading.present();
    }
    this.auditService.getBins(this.loggedInUser.user_id, this.auditID, 'Complete').subscribe(
      async (res) => {
        await whileLoading.dismiss();
        this.completedBins = res;
        this.blankMessage = `No bins have been completed for Audit ${this.auditID}`;
        this.completeRefresh();
      },
      async (res) => {
        this.blankMessage = `There was a problem trying to fetch the completed bins for Audit ${this.auditID}`;
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

  async doRefresh(event) {
    this.refreshEvent = event;
    if (this.currentSegment === Segment.COMPLETED_BINS) {
      this.getCompletedBins();
    }
    else if (this.currentSegment === Segment.BINS) {
      this.getBins();
    }
  }

  async completeRefresh() {
    if (this.refreshEvent) {
      this.refreshEvent.target.complete();
      this.refreshEvent = null;
    }
  }

  displayProgression(event, binID) {
    event.preventDefault();
    event.stopPropagation();
    this.presentProgressionMetricsPopover(event, binID);
  }

  async presentProgressionMetricsPopover(ev: any, binID) {
    const popover = await this.popoverController.create({
      component: ProgressionMetricsPopoverComponent,
      event: ev,
      translucent: true,
      showBackdrop: true,
      componentProps: { binID, auditID: this.auditID },
    });
    return await popover.present();
  }

  segmentChanged(ev: CustomEvent) {
    this.currentSegment = ev.detail.value;
    this.blankMessage = '';

    if (this.currentSegment === Segment.BINS) {
      this.getBins();
    }
    else if (this.currentSegment === Segment.COMPLETED_BINS) {
      this.getCompletedBins();
    }
  }

}
