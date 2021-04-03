import { Component, OnInit, HostListener, TemplateRef } from '@angular/core';
import { AuditLocalStorage, ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDeactivateComponent } from '../../guards/can-deactivate.guard';

@Component({
  selector: 'app-review-audit',
  templateUrl: './review-audit.component.html',
  styleUrls: ['./review-audit.component.scss']
})
export class ReviewAuditComponent implements OnInit, IDeactivateComponent {
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['stockkeeper', 'bins', 'numberparts', 'initiator', 'initiationdate'];
  locationsAndUsers: Array<any>;
  auditID: number;
  binData: any;
  currentUser: any;

  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';
  requestConfirmation = true;
  title = 'Review Audit';
  actionButtons = {
    expand: 'Expand All', collapse: 'Collapse All', back: 'Go Back', discard: 'Discard', confirm: 'Confirm', cancel: 'Cancel'
  };
  tableHeaders = {
    stock_keeper: 'Stock Keeper', bins: 'Bins', num_parts: 'Number of Parts', init_by: 'Initiated by', init_on: 'Initiated on'
  };

  constructor(
    private dialog: MatDialog,
    private manageAuditsService: ManageAuditsService,
    private authservice: AuthService,
    private router: Router) {
    this.dataSource = new MatTableDataSource<any>();
    this.locationsAndUsers = [];
    this.currentUser = null;
    this.auditID = Number(this.manageAuditsService.getLocalStorage(AuditLocalStorage.AuditId));
  }

  ngOnInit(): void {
    this.getTableData();
  }

  getTableData(): void {
    if (this.auditID) {
      this.manageAuditsService.getAssignedBins(this.auditID).subscribe(
        (res) => {
          this.binData = res;
          const id: any = localStorage.getItem('id');
          this.authservice.getCurrentUser(id).subscribe((user) => {
            this.currentUser = user;
            this.buildTable();
          });
        });
    }
  }

  buildTable(): void {
    const table: any[] = [];
    const locations: any[] = [];

    this.binData.forEach((bin: any) => {
      if (!locations.some(loc => loc.location === bin.customuser.location)) {
        locations.push({ location: bin.customuser.location });
      }
    });

    this.locationsAndUsers = locations;

    this.binData.forEach((bin: any) => {
      const initDate = new Date(bin.init_audit.initiated_on);
      const pasteDate = (initDate.getMonth() + 1) + '/' + initDate.getDate() + '/' + initDate.getFullYear() + ' ' +
        initDate.getHours() + ':' + initDate.getMinutes();
      table.push(
        {
          name: bin.customuser.first_name + ' ' + bin.customuser.last_name,
          bins: bin.Bin,
          numberOfParts: JSON.parse(bin.item_ids.replaceAll('\'', '"')).length,
          initiatedBy: this.currentUser.first_name + ' ' + this.currentUser.last_name,
          date: pasteDate,
          location: bin.customuser.location
        }
      );
    });
    this.dataSource = new MatTableDataSource(table);
  }

  goBackDesignateSK(): void {
    this.requestConfirmation = false;
    this.router.navigate(['audits/assign-sk/designate-sk'], { replaceUrl: true });
  }

  deleteBinSKData(): void {
    this.binData.forEach(async (bin: any) => {
      await this.manageAuditsService.deletePreAudit(bin.bin_id).subscribe(
        (err) => {
          this.errorMessage = err;
        });
    });
  }

  deleteAudit(): void {
    this.manageAuditsService.deleteAudit(this.auditID).subscribe((
      (err) => {
        this.errorMessage = err;
      }));
    this.manageAuditsService.removeFromLocalStorage(AuditLocalStorage.AuditId);
  }

  confirmReviewAuditData(): void {
    this.manageAuditsService.assignSK({ status: 'Active' }, Number(localStorage.getItem('audit_id'))).subscribe(
      (data) => {
        setTimeout(() => {
          this.manageAuditsService.removeFromLocalStorage(AuditLocalStorage.AuditId);
          this.requestConfirmation = false;
          this.router.navigate(['audits'], { replaceUrl: true });
        }, 1000);
      }
    );
  }

  openDialogWithRef(ref: TemplateRef<any>): void {
    this.dialog.open(ref);
  }

  cancelDialog(): void {
    this.dialog.closeAll();
  }

  discardAudit(): void {
    this.requestConfirmation = false;
    this.deleteAudit();
    this.dialog.closeAll();
  }
  // handles page refresh and out-of-app navigation
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any): boolean {
    return confirm('');
  }
}
