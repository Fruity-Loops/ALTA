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
        sk_location: auditSK.location,
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
        sk_location: "",
        item_ids: new Array<any>(),
        bins: new Array<any>()
      });
    }
    const index = this.binToSks.findIndex(predefinedId => predefinedId.sk_id === httpId);
    return this.binToSks[index].bins;
  }

   getAssociatedItemsGivenBin(location: string, bin: any[]): any[] {
    let holdItems = new Array<any>();
    const index = this.locationsWithBinsAndSKs.findIndex(predefinedLoc => predefinedLoc.Location === location);
    this.locationsWithBinsAndSKs[index].item.forEach(item =>
      bin.forEach(givenBin => {
        if(item.Bin === givenBin) {
          holdItems.push(item)
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
            const addedBin = holdItemsOfBins.find(predefinedBin => predefinedBin === bin)
            if(addedBin === undefined ) {
              const addedSK = holdBodyPreAuditData.find(predefinedSK => predefinedSK.customuser === auditComp.sk_id)
              if(addedSK === undefined ) {
                holdItemsOfBins = this.getAssociatedItemsGivenBin(auditComp.sk_location, auditComp.bins)
                if(holdItemsOfBins.length > 0) {
                  holdBodyPreAuditData.push(
                  {
                    init_audit: Number(localStorage.getItem('audit_id')),
                    customuser: auditComp.sk_id,
                    bins: auditComp.bins,
                    item_ids: holdItemsOfBins
                  }), holdItemsOfBins = new Array<any>()
                }
              }
            }
        })
    });

    holdBodyPreAuditData.forEach(bodyPreAuditData =>
      this.manageAuditsService.initiatePreAudit(bodyPreAuditData)
        .subscribe((response) => {
          (err) => {
            this.errorMessage = err;
          }})
    );

    this.locationsWithBinsAndSKs = [];
    this.binToSks = [];
    localStorage.removeItem('audit_id');

    setTimeout(() => {
          // Redirect user to component dashboard
          this.router.navigate(['dashboard']);
    }, 1000); // Waiting 1 second before redirecting the user
  }

  drop(event: CdkDragDrop<string[]>, testing: any) {
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
