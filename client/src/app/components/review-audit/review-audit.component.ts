import { Component, OnInit, TemplateRef } from '@angular/core';
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

  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';

  constructor(
    private dialog: MatDialog,
    private manageAuditsService: ManageAuditsService,
    private router: Router) {
    this.dataSource = new MatTableDataSource<any>();
    this.locationsAndUsers = [];
  }

  ngOnInit(): void {

    this.getTableData();
  }

  getTableData(): void {

    this.manageAuditsService.getAuditData(Number(localStorage.getItem('audit_id')))
      .subscribe((auditData) => {
        const assignedSks = auditData.assigned_sk;

        this.manageAuditsService.getItemSKAudit(Number(localStorage.getItem('audit_id')))
          .subscribe((itemSKData) => {
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

  buildTable(itemSKData: any, sks: any): void{
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

  goBackManageSK(): void {
    // TODO: save data so when user goes back to previous page, previously selected info is kept
    setTimeout(() => {
      // Redirect user to component dashboard
      this.router.navigate(['designate-sk']);
    }, 1000); // Waiting 1 second before redirecting the user
  }

  confirmReviewAuditData(): void {
    setTimeout(() => {
      // Redirect user to component dashboard
      this.router.navigate(['dashboard']);
    }, 1000); // Waiting 1 second before redirecting the user

    localStorage.removeItem('audit_id');
  }

  openDialogWithRef(ref: TemplateRef<any>): void {
    this.dialog.open(ref);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
