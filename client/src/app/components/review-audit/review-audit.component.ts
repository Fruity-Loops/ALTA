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

  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';

 constructor(private manageMembersService: ManageMembersService,
              private dialog: MatDialog,
              private manageAuditsService: ManageAuditsService,
              private router: Router)
  { }

  ngOnInit(): void {
  }

  openDialogWithRef(ref: TemplateRef<any>): void {
    this.dialog.open(ref);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  checkDisableButton(binArray: any[]): boolean {
    return binArray.map(index => index.bins).every(array => array.length <= 0);
  }


}
