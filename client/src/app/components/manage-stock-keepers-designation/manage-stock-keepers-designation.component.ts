import { Component, HostListener, OnInit, TemplateRef } from '@angular/core';
import { AuditLocalStorage, ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SKUser } from 'src/app/models/user.model';
import { Item } from 'src/app/models/item.model';
import { Observable, Subscription } from 'rxjs';
import { IDeactivateComponent } from '../../guards/can-deactivate.guard';

@Component({
  selector: 'app-manage-stock-keepers-designation',
  templateUrl: './manage-stock-keepers-designation.component.html',
  styleUrls: ['./manage-stock-keepers-designation.component.scss']
})
export class ManageStockKeepersDesignationComponent implements OnInit, IDeactivateComponent {

  preAuditData: any;
  locationsWithBinsAndSKs: Array<any>;
  binToSks: Array<any>;
  subscription: Subscription;
  auditID: number;

  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';
  isDirty = true;

  constructor(
    private dialog: MatDialog,
    private manageAuditsService: ManageAuditsService,
    private router: Router) {
    this.locationsWithBinsAndSKs = new Array<any>();
    this.binToSks = new Array<any>();
    this.auditID = Number(this.manageAuditsService.getLocalStorage(AuditLocalStorage.AuditId));
  }

  ngOnInit(): void {
    this.manageAuditsService.getAuditData(this.auditID)
      .subscribe((auditData) => {
        this.populateBinsAndSKs(auditData.inventory_items, auditData.assigned_sk);
    });

    this.manageAuditsService.getAssignedBins(this.auditID)
      .subscribe((auditData) => {
        if (auditData !== []) {
          const listOfSKs = auditData.map(obj => obj.customuser);
          listOfSKs.forEach((index: any) => {

            let skToUpdate = this.binToSks.find(obj => obj.sk_id === index.id);

            // check if user assigned a different SK from original
            if (skToUpdate !== undefined) {
              let getAssignedData = auditData.find(obj => obj.customuser === index);

              // add in the bins
              skToUpdate.bins.push(getAssignedData.Bin);

              // add in the item_ids
              skToUpdate.item_ids = getAssignedData.item_ids;
            }
          });

          /* remove from original array
          this.locationsWithBinsAndSKs.forEach(element => {
            element.item = [];
            element.bins = [];
          });
*/

          console.log("hold init data: ", this.locationsWithBinsAndSKs)
          console.log("hold page data: ", this.binToSks)
          console.log("hold previous data: ", auditData)
        }
    });
  }

  autoAssign(): void {
    let sksOfCurrentLocation = [];
    let associatedItems = [];

    this.locationsWithBinsAndSKs.forEach(index => {
      let currentSK = 0;
      index.bins.forEach((bin: any) => {

        associatedItems = this.getAssociatedItemsGivenBin(index.Location, [bin]);
        const associatedItemsIds = associatedItems.map(item => item.Item_Id);

        sksOfCurrentLocation = this.binToSks.filter(obj => obj.sk_location === index.Location);
        const currentToAssign = currentSK % sksOfCurrentLocation.length;

        sksOfCurrentLocation[currentToAssign].bins.push(bin);
        sksOfCurrentLocation[currentToAssign].item_ids = associatedItemsIds;

        currentSK++;
      });
      index.bins = [];
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

  identifyUser(httpId: number): [] {
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
    this.locationsWithBinsAndSKs[index].item.forEach((item: any) =>
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

    // loop through the assigned bins from the drag and drop arrays
    this.binToSks.forEach(auditComp => {
      auditComp.bins.forEach((bin: any) => {
        holdItemsOfBins = this.getAssociatedItemsGivenBin(auditComp.sk_location, [bin]);

        if (holdItemsOfBins.length > 0) {
          // construct array to hold the item ids
          const holdIds = holdItemsOfBins.map(item => item.Item_Id);
          holdBodyPreAuditData.push(
            {
              Bin: bin,
              init_audit: this.auditID,
              customuser: auditComp.sk_id,
              item_ids: holdIds,
            });
          // empty array for next bin in loop
          holdItemsOfBins = new Array<any>();
        }
      });
    });

    holdBodyPreAuditData.forEach(bodyPreAuditData => {
      this.manageAuditsService.initiatePreAudit(bodyPreAuditData)
        .subscribe((err) => {
          this.errorMessage = err;
        });
    });

    this.locationsWithBinsAndSKs = [];
    this.binToSks = [];
    this.isDirty = false;

    setTimeout(() => {
      // Redirect user to review-audit component
      this.router.navigate(['audits/assign-sk/designate-sk/review-audit']);
    }, 1000); // Waiting 1 second before redirecting the user
  }

  deleteAudit(): void {
    this.manageAuditsService.deleteAudit(this.auditID).subscribe((
      (err) => {
        this.errorMessage = err;
      }));
    this.manageAuditsService.removeFromLocalStorage(AuditLocalStorage.AuditId);
  }

  goBackAssignSK(): void {
    setTimeout(() => {
      this.router.navigate(['audits/assign-sk'], { replaceUrl: true });
    }, 1000);
  }

  drop(event: CdkDragDrop<string[]>, testing: any): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.isDirty = true;
    }
  }

  openDialogWithRef(ref: TemplateRef<any>): void {
    this.dialog.open(ref);
  }

  cancelDialog(): void {
    this.dialog.closeAll();
  }

  discardAudit(): void {
    this.isDirty = false;
    this.deleteAudit();
    this.dialog.closeAll();
  }

  disableAssign(): boolean {
    if (this.locationsWithBinsAndSKs.map((obj: any) => obj.bins).flat().length === 0) {
      for (let i = 0; i < this.binToSks.length; ++i) {
        if (this.binToSks[i].bins.length === 0) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isDirty) {
      if (confirm('Warning, there are unsaved changes. If you confirm the changes will be lost.')) {
        this.subscription = this.router.events.subscribe((event: any) => {
console.log(event)
          // if event is a navigation attempt
          if (event instanceof NavigationEnd) {
            this.isDirty = false;

            // see if navigation is to previous, next, or current page
            if (event.urlAfterRedirects === '/audits/assign-sk' ||
                event.urlAfterRedirects === '/audits/assign-sk/designate-sk/review-audit' ||
                event.urlAfterRedirects === '/audits/assign-sk/designate-sk') {
              return true;
            } else {
              this.deleteAudit();
              return true;
            }
          }
        });
        this.isDirty = false;
      }
    }
    return !this.isDirty;
  }
}
