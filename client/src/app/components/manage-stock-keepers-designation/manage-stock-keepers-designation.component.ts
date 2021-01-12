import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { ManageAuditsService } from 'src/app/services/manage-audits.service';
import { PreAudit } from 'src/app/models/pre-audit.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { SKUser } from 'src/app/models/user.model';
import { Item } from 'src/app/models/item.model';

@Component({
  selector: 'app-manage-stock-keepers-designation',
  templateUrl: './manage-stock-keepers-designation.component.html',
  styleUrls: ['./manage-stock-keepers-designation.component.scss']
})
export class ManageStockKeepersDesignationComponent implements OnInit {

  preAuditData: PreAudit;
  locationsWithBinsAndSKs: Array<any>;
  binToSks: Array<any>;

  panelOpenState: boolean = false;
  allExpandState = false;
  errorMessage = '';

  constructor(private manageMembersService: ManageMembersService,
              private dialog: MatDialog,
              private manageAuditsService: ManageAuditsService,
              private router: Router)
  { }

  ngOnInit(): void {
    this.locationsWithBinsAndSKs = new Array<any>();
    this.binToSks = new Array<any>();

    this.manageAuditsService.getAuditData(Number(localStorage.getItem('audit_id')))
    .subscribe((auditData) => {
      const preAuditData = auditData;
      this.populateBinsAndSKs(preAuditData.inventory_items, preAuditData.assigned_sk);
    });
  }

  populateBinsAndSKs(selected_items: Item[], assigned_sks: SKUser[]): void {
    selected_items.forEach(auditItem => {
      const obj = this.locationsWithBinsAndSKs.find(predefinedLoc => predefinedLoc.Location === auditItem.Location);
      if(obj === undefined) {
        this.locationsWithBinsAndSKs.push(
        {
          Location: auditItem.Location,
          item: new Array<Item>(auditItem),
          bins: new Array<any>(auditItem.Bin),
          sk: new Array<SKUser>()
        })
      } else {
        const index = this.locationsWithBinsAndSKs.findIndex(predefinedLoc => predefinedLoc.Location === auditItem.Location);
        this.locationsWithBinsAndSKs[index].item.push(auditItem);

        if(!this.locationsWithBinsAndSKs[index].bins.find(predefinedBin => predefinedBin === auditItem.Bin)){
          this.locationsWithBinsAndSKs[index].bins.push(auditItem.Bin);
        }
      }
    });

    assigned_sks.forEach(auditSK => {
      const obj = this.locationsWithBinsAndSKs.find(predefinedLoc => predefinedLoc.Location === auditSK.location);
      if(obj === undefined) {
        this.locationsWithBinsAndSKs.push(
        {
          Location: auditSK.location,
          sk: new Array<SKUser>(auditSK)
        })
      } else {
        const index = this.locationsWithBinsAndSKs.findIndex(predefinedLoc => predefinedLoc.Location === auditSK.location);
        this.locationsWithBinsAndSKs[index].sk.push(auditSK);
      }
      this.binToSks.push(
      {
        sk_id: auditSK.id,
        item_ids: new Array<any>(),
        bins: new Array<any>()
      });
    });
  }

  identifyUser(httpId: number): []{
    const obj = this.binToSks.find(predefinedId => predefinedId.sk_id === httpId);
    if(obj === undefined) {
      this.binToSks.push(
      {
        sk_id: httpId,
        item_ids: new Array<any>(),
        bins: new Array<any>()
      });
    }
    const index = this.binToSks.findIndex(predefinedId => predefinedId.sk_id === httpId);
    return this.binToSks[index].bins;
  }

/*
  submitAssignedSKs(): void {
    let bodyAssignedSK: any;
    bodyAssignedSK = {
      assigned_sk: this.skToAssign,
    };
    this.addAssignedSK.assignSK(bodyAssignedSK, Number(localStorage.getItem('audit_id'))).subscribe(
      (data) => {
        this.skToAssign = [];
        setTimeout(() => {
          // Redirect user to component dashboard
          this.router.navigate(['dashboard']);
        }, 1000); // Waiting 1 second before redirecting the user
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }
*/
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  openDialogWithRef(ref: TemplateRef<any>) {
    this.dialog.open(ref);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
