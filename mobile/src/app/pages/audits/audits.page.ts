import { Component, OnInit } from '@angular/core';
import { AuditService } from 'src/app/services/audit.service';
import { fetchLoggedInUser } from 'src/app/services/cache';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.page.html',
  styleUrls: ['./audits.page.scss'],
})
export class AuditsPage implements OnInit {
  audits: Array<any>;
  loggedInUser: any;

  constructor(
    private auditService: AuditService,
  ) {
  }

  ngOnInit() {
    this.getAudits();
  }

  getAudits() {
    fetchLoggedInUser().then(
      user => {
        if (user) {
          this.loggedInUser = user;
          this.auditService.getAudits(user.user_id).subscribe(
            res => {
              this.audits = res;
            });
        }
      });
  }
}
