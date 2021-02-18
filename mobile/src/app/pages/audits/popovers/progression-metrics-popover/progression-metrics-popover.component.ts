import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { fetchLoggedInUser } from 'src/app/services/cache';
import { AuditService } from 'src/app/services/audit.service';

@Component({
  selector: 'app-progression-metrics-popover',
  templateUrl: './progression-metrics-popover.component.html',
  styleUrls: ['./progression-metrics-popover.component.scss'],
  providers: [NavParams],
})
export class ProgressionMetricsPopoverComponent implements OnInit {
  loggedInUser: any;
  progressionMetrics: any;
  errorMessage: any;
  auditID: string;

  constructor(
    public navParams: NavParams,
    public popoverController: PopoverController,
    private auditService: AuditService,
  ) {
    this.auditID = this.navParams.get('auditID');
  }

  ngOnInit() {
    this.getAuditProgressionMetrics();
  }

  async getAuditProgressionMetrics() {
    fetchLoggedInUser().then(
      user => {
        if (user) {
          this.loggedInUser = user;
          this.auditService.getAuditProgressionMetrics(
            user.user_id,
            user.organization_id,
            this.auditID || this.navParams.get('auditID'),
          ).subscribe(
            async (res) => {
              this.progressionMetrics = res;
            },
            async (res) => {
              this.errorMessage = 'There was a problem trying to fetch progression metrics';
            });
        }
      });
  }


  async dismissPopover() {
    await this.popoverController.dismiss();
  }

}
