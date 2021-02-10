import { Component, OnInit, TemplateRef, HostListener } from '@angular/core';
import { ManageAuditsService } from 'src/app/services/manage-audits.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-audit',
  templateUrl: './review-audit.component.html',
  styleUrls: ['./review-audit.component.scss']
})
export class ReviewAuditComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['stockkeeper', 'bins', 'numberparts', 'initiator', 'initiationdate'];
  locationsAndUsers: Array<any>;
  auditID: number;
  itemData: Array<any>;
  currentUser: any;

  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';

  constructor(
    private dialog: MatDialog,
    private manageAuditsService: ManageAuditsService,
    private authservice: AuthService,
    private router: Router) {
    this.dataSource = new MatTableDataSource<any>();
    this.locationsAndUsers = [];
    this.currentUser = null;
    this.itemData = [];
    this.auditID = Number(localStorage.getItem('audit_id'));
  }

  ngOnInit(): void {
    this.getTableData();
  }

  getTableData(): void {
    if (this.auditID) {
      this.manageAuditsService.getAssignedBins(this.auditID).subscribe(
        (auditData) => {
          const id: any = localStorage.getItem('id')
          this.authservice.getCurrentUser(id).subscribe((user) => {
            this.currentUser = user;
            this.buildTable(auditData);
          });
        });
    }
  }

  buildTable(itemSKData: any): void {
    const table: any[] = [];
    const locations: any[] = [];

    itemSKData.forEach((bin: any) => {
      if (!locations.some(loc => loc.location === bin.customuser.location)) {
        locations.push({ location: bin.customuser.location });
      }
    });

    this.locationsAndUsers = locations;

    itemSKData.forEach((bin: any) => {
      table.push(
        {
          name: bin.customuser.first_name + ' ' + bin.customuser.last_name,
          bins: bin.Bin,
          numberOfParts: JSON.parse(bin.item_ids).length,
          initiatedBy: this.currentUser.first_name + ' ' + this.currentUser.last_name,
          date: bin.initiated_on ? bin.initiated_on : 'N/A',
          location: bin.customuser.location
        }
      );
    });
    this.dataSource = new MatTableDataSource(table);
  }

  @HostListener('window:popstate', ['$event'])
  onBrowserBack(event: Event): void {
    event.preventDefault();
    this.goBackManageSK();
  }

  goBackManageSK(): void {
    this.deleteItemToSKData();
    this.router.navigate(['audits/assign-sk/designate-sk'], { replaceUrl: true });
  }

  deleteItemToSKData(): void {
    this.itemData.forEach(async item => {
      await this.manageAuditsService.deletePreAudit(item.itemtoSk_id).subscribe((
        (err) => {
          this.errorMessage = err;
        }));
    });
  }

  deleteAudit(): void {
    this.manageAuditsService.deleteAudit(this.auditID).subscribe((
      (err) => {
        this.errorMessage = err;
      }));
    localStorage.removeItem('audit_id');
  }

  confirmReviewAuditData(): void {
    setTimeout(() => {
      this.router.navigate(['audits'], { replaceUrl: true });
    }, 1000);

    localStorage.removeItem('audit_id');
  }

  openDialogWithRef(ref: TemplateRef<any>): void {
    this.dialog.open(ref);
  }

  cancelDialog(): void {
    this.dialog.closeAll();
  }

  discardAudit(): void {
    this.deleteAudit();
    this.dialog.closeAll();
  }
}
