import { Component, OnInit, TemplateRef, HostListener } from '@angular/core';
import { ManageAuditsService } from 'src/app/services/manage-audits.service';
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
  displayedColumns: string[] = ['Stock_Keeper', 'Bins', 'Nb_Parts', 'Initiator', 'InitiationDate'];
  locationsAndUsers: Array<any>;
  auditID: number;
  itemData: Array<any>;

  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';

  constructor(
    private dialog: MatDialog,
    private manageAuditsService: ManageAuditsService,
    private router: Router) {
    this.dataSource = new MatTableDataSource<any>();
    this.locationsAndUsers = [];
    this.itemData = [];
    this.auditID = Number(localStorage.getItem('audit_id'));
  }

  ngOnInit(): void {
    this.getTableData();
  }

  getTableData(): void {

    this.manageAuditsService.getAuditData(this.auditID)
      .subscribe((auditData) => {
        const assignedSks = auditData.assigned_sk;

        this.manageAuditsService.getItemSKAudit(this.auditID)
          .subscribe((itemSKData) => {
            this.itemData = itemSKData;
            assignedSks.forEach((sk: any) => {
              itemSKData.forEach((itemSK: any) => {
                if (sk.id === itemSK.customuser) {
                  itemSK.location = sk.location;
                }
              });
            });
            this.buildTable(itemSKData, assignedSks);
          });
      });
  }

  buildTable(itemSKData: any, sks: any): void {
    const table: any[] = [];
    const locations: any[] = [];

    sks.forEach((item: any) => {
      locations.push({ location: item.location });
    });

    this.locationsAndUsers = locations;

    itemSKData.forEach((sk: any) => {
      table.push(
        {
          name: this.getSKName(sks, sk.customuser),
          bins: sk.bins,
          numberOfParts: JSON.parse(sk.item_ids).length,
          initiatedBy: 'N/A',
          date: 'N/A',
          location: sk.location,
        }
      );
    });
    this.dataSource = new MatTableDataSource(table);
  }

  getSKName(sks: any, id: any): string {
    for (const sk of sks) {
      if (sk.id === id) {
        return sk.first_name + ' ' + sk.last_name;
      }
    }
    return 'N/A';
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
