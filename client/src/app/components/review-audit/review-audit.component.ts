import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ManageAuditsService } from 'src/app/services/manage-audits.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review-audit',
  templateUrl: './review-audit.component.html',
  styleUrls: ['./review-audit.component.scss']
})
export class ReviewAuditComponent implements OnInit {
  // skAssigned = [];
  dataSource;
  displayedColumns: string[] = ['Stock_Keeper', 'Bins', 'Nb_Parts', 'Initiator', 'InitiationDate'];
  locationsAndUsers: Array<any>;

  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';

  constructor(
    private dialog: MatDialog,
    private manageAuditsService: ManageAuditsService,
    private router: Router) { }

  ngOnInit(): void {
    console.log(this.dataSource);
    this.getTableData();
  }

  getTableData(): void {
    let assignedSks;

    this.manageAuditsService.getAuditData(Number(localStorage.getItem('audit_id')))
      .subscribe((auditData) => {
        assignedSks = auditData.assigned_sk;

        this.manageAuditsService.getItemSKAudit(Number(localStorage.getItem('audit_id')))
          .subscribe((itemSKData) => {
            assignedSks.forEach(sk => {
              itemSKData.forEach(itemSK => {
                if (sk.id === itemSK.customuser) {
                  itemSK.location = sk.location;
                }
              });
            });
            this.buildTable(itemSKData, assignedSks);
          });
      });
  }

  buildTable(itemSKData, sks): void {
    const table = [];
    const locations = [];

    sks.forEach(item => {
      locations.push({ location: item.location });
    });

    this.locationsAndUsers = locations;

    itemSKData.forEach(sk => {
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
    this.dataSource = table;
  }

  getSKName(sks, id): void {
    let name;
    sks.forEach(sk => {
      if (sk.id === id) {
        name = sk.first_name + ' ' + sk.last_name;
      }
    });
    return name;
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
