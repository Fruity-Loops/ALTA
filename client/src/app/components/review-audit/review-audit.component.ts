import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { ManageAuditsService } from 'src/app/services/manage-audits.service';
import { User } from 'src/app/models/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';


@Component({
  selector: 'app-review-audit',
  templateUrl: './review-audit.component.html',
  styleUrls: ['./review-audit.component.scss']
})
export class ReviewAuditComponent implements OnInit {
  // skAssigned = [];
   dataSource: MatTableDataSource<User>;
   displayedColumns: string[] = ['Stock_Keeper', 'Bins', 'Aisle', 'Nb_Parts', 
   'Part_Description', 'Initiator', 'InitiationDate'];
  // locationsAndUsers: Array<any>;

  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';

 constructor(private manageMembersService: ManageMembersService,
              private dialog: MatDialog,
              private manageAuditsService: ManageAuditsService,
              private router: Router)
  { }

  ngOnInit(): void {
    this.manageAuditsService.getAuditData(Number(localStorage.getItem('audit_id')))
    .subscribe((auditData) => {
      console.log(auditData.inventory_items)
      console.log(auditData.assigned_sk)
    });

    this.manageAuditsService.getItemSKAudit(Number(localStorage.getItem('audit_id')))
    .subscribe((auditData) => {
      console.log(auditData)
    });
  
  }

  goBackManageSK(): void {
    //TODO: save data so when user goes back to previous page, previously selected info is kept
    setTimeout(() => {
      // Redirect user to component dashboard
      this.router.navigate(['designate-sk']);
    }, 1000); // Waiting 1 second before redirecting the user
}

  confirmReviewAuditData(): void{
    setTimeout(() => {
      // Redirect user to component dashboard
      this.router.navigate(['dashboard']);
    }, 1000); // Waiting 1 second before redirecting the user

    localStorage.removeItem('audit_id'); // Removing audit_id from localstorage
    // Not a good idea to use this if this page is meant to be opned and referenced independently
    // (anytime after audit creation steps)
  }



  openDialogWithRef(ref: TemplateRef<any>): void {
    this.dialog.open(ref);
  }
  
  closeDialog(): void {
    this.dialog.closeAll();
  }
}
