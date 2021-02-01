import { Component, OnInit } from '@angular/core';
import { AuditService } from 'src/app/services/audit.service';
import { ActivatedRoute } from '@angular/router';
import { fetchLoggedInUser } from 'src/app/services/cache';

@Component({
  selector: 'app-bins',
  templateUrl: './bins.page.html',
  styleUrls: ['./bins.page.scss'],
})
export class BinsPage implements OnInit {
  auditID: string;
  bins: Array<any>;
  loggedInUser: any;

  constructor(
    private auditService: AuditService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getSelectedAudit();
    this.getBins();
  }

  getSelectedAudit() {
    this.auditID = this.activatedRoute.snapshot.paramMap.get('audit_id');
  }

  getBins() {
    fetchLoggedInUser().then(
      user => {
        if (user) {
          this.loggedInUser = user;
          this.auditService.getBins(user.user_id, this.auditID).subscribe(
            res => {
              this.bins = res;
            });
        }
      });
  }
}
