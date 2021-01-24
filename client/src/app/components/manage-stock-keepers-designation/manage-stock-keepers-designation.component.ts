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

  panelOpenState = false;
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
      this.populateBinsAndSKs(auditData.inventory_items, auditData.assigned_sk);
    });
  }

  populateBinsAndSKs(selectedItems: Item[], assignedSks: SKUser[]): void {
    /* TODO: look into performance impact of:
    * 1. returning a large amount of items
    * 2. returning a large amount of users
    */
    selectedItems.forEach(auditItem => {
      const obj = this.locationsWithBinsAndSKs.find(predefinedLoc => predefinedLoc.Location === auditItem.Location);
      if (obj === undefined) {
        this.locationsWithBinsAndSKs.push(
        {
          Location: auditItem.Location,
          item: new Array<Item>(auditItem),
          bins: new Array<any>(auditItem.Bin),
          sk: new Array<SKUser>()
        });
      } else {
        obj.item.push(auditItem);

        if (!obj.bins.includes(auditItem.Bin)) {
          obj.bins.push(auditItem.Bin);
        }
      }
    });

    assignedSks.forEach(auditSK => {
      const obj = this.locationsWithBinsAndSKs.find(predefinedLoc => predefinedLoc.Location === auditSK.location);
      if (obj === undefined) {
        this.locationsWithBinsAndSKs.push(
        {
          Location: auditSK.location,
          sk: new Array<SKUser>(auditSK)
        });
      } else {
        obj.sk.push(auditSK);
      }
      this.binToSks.push(
      {
        sk_id: auditSK.id,
        sk_location: auditSK.location,
        item_ids: new Array<any>(),
        bins: new Array<any>()
      });
    });
  }

  identifyUser(httpId: number): []{
    const obj = this.binToSks.find(predefinedId => predefinedId.sk_id === httpId);
    if (obj === undefined) {
      this.binToSks.push(
      {
        sk_id: httpId,
        sk_location: '',
        item_ids: new Array<any>(),
        bins: new Array<any>()
      });
    }
    const index = this.binToSks.findIndex(predefinedId => predefinedId.sk_id === httpId);
    return this.binToSks[index].bins;
  }

   getAssociatedItemsGivenBin(location: string, bin: any[]): any[] {
    const holdItems = new Array<any>();
    const index = this.locationsWithBinsAndSKs.findIndex(predefinedLoc => predefinedLoc.Location === location);
    this.locationsWithBinsAndSKs[index].item.forEach(item =>
      bin.forEach(givenBin => {
        if (item.Bin === givenBin) {
          holdItems.push(item);
        }
      })
    );
    return holdItems;
  }

  submitPreAuditData(): void {
    const holdBodyPreAuditData = new Array<any>();
    let holdItemsOfBins = new Array<any>();

    this.binToSks.forEach(auditComp => {
        auditComp.bins.forEach(bin => {
          if (!holdItemsOfBins.find(predefinedBin => predefinedBin === bin) &&
              !holdBodyPreAuditData.find(predefinedSK => predefinedSK.customuser === auditComp.sk_id)) {
                holdItemsOfBins = this.getAssociatedItemsGivenBin(auditComp.sk_location, auditComp.bins);
                if (holdItemsOfBins.length > 0) {
                  const holdIds = holdItemsOfBins.map(item => item._id);
                  holdBodyPreAuditData.push(
                  {
                    init_audit: Number(localStorage.getItem('audit_id')),
                    customuser: auditComp.sk_id,
                    bins: auditComp.bins,
                    item_ids: holdIds
                  }), holdItemsOfBins = new Array<any>();
                }
          }
        });
    });

    holdBodyPreAuditData.forEach(bodyPreAuditData =>
      this.manageAuditsService.initiatePreAudit(bodyPreAuditData)
        .subscribe((err) => {
            this.errorMessage = err;
          })
    );

    this.locationsWithBinsAndSKs = [];
    this.binToSks = [];
    localStorage.removeItem('audit_id');

    setTimeout(() => {
          // Redirect user to component dashboard
          this.router.navigate(['review-audit']);
    }, 1000); // Waiting 1 second before redirecting the user
  }

  drop(event: CdkDragDrop<string[]>, testing: any): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
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
