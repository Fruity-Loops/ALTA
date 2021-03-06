import { Component, OnInit, HostListener, TemplateRef } from '@angular/core';
import { AuditLocalStorage, ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SKUser } from 'src/app/models/user.model';
import { Item } from 'src/app/models/item.model';
import { IDeactivateComponent } from '../../guards/can-deactivate.guard';
import {
  ManageStockKeepersDesignationActionButtons,
  ManageStockKeepersDesignationLangFactory
} from './manage-stock-keepers-designation.language';

@Component({
  selector: 'app-manage-stock-keepers-designation',
  templateUrl: './manage-stock-keepers-designation.component.html',
  styleUrls: ['./manage-stock-keepers-designation.component.scss']
})
export class ManageStockKeepersDesignationComponent implements OnInit, IDeactivateComponent {

  preAuditData: any;
  locationsWithBinsAndSKs: Array<any>;
  binToSks: Array<any>;
  holdBinIdsOfPreviousAssign: Array<any>;
  auditID: number;

  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';
  requestConfirmation = true;

  title: string;
  binsTitle: string;
  actionButtons: ManageStockKeepersDesignationActionButtons;

  constructor(
    private dialog: MatDialog,
    private manageAuditsService: ManageAuditsService,
    public router: Router) {
    this.locationsWithBinsAndSKs = new Array<any>();
    this.binToSks = new Array<any>();
    this.holdBinIdsOfPreviousAssign = new Array<any>();
    this.auditID = Number(this.manageAuditsService.getLocalStorage(AuditLocalStorage.AuditId));

    const lang = new ManageStockKeepersDesignationLangFactory();
    [this.title, this.binsTitle, this.actionButtons] = [lang.lang.title, lang.lang.binsTitle, lang.lang.actionButtons];
  }

  ngOnInit(): void {
    this.manageAuditsService.getAuditData(this.auditID)
      .subscribe((auditData) => {
        this.populateBinsAndSKs(auditData.inventory_items, auditData.assigned_sk);
    });

    this.manageAuditsService.getAssignedBins(this.auditID)
      .subscribe((auditData) => {
        if (auditData !== []) {
          this.holdBinIdsOfPreviousAssign = auditData.map((obj: any) => ({ bin_id: obj.bin_id, Bin: obj.Bin }));

          const listOfSKs = auditData.map((obj: any) => obj.customuser);
          listOfSKs.forEach((index: any) => {

            const skToUpdate = this.binToSks.find(obj => obj.sk_id === index.id);

            // check if user assigned a different SK from original
            if (skToUpdate !== undefined) {
              const getAssignedData = auditData.find((obj: any) => obj.customuser === index);

              // create iterable array from the string of assigned stock-keepers id
              let arrayFromString = getAssignedData.item_ids.replace(/'/g, '"');
              arrayFromString = JSON.parse(arrayFromString);

              // add in the item_ids
              arrayFromString.forEach((id: any) => {
                skToUpdate.item_ids.push(id);
              });

              // add in the bins
              skToUpdate.bins.push(getAssignedData.Bin);

              // remove bin from original array
              const locationToUpdate = this.locationsWithBinsAndSKs.find(obj => obj.Location === skToUpdate.sk_location);
              locationToUpdate.bins.splice(
                locationToUpdate.bins.indexOf(getAssignedData.Bin),
                1
              );
            }
          });
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
    const holdBodyPreAuditDataWithoutBinIDs = new Array<any>();
    const holdBodyPreAuditDataWithBinIDs = new Array<any>();
    let holdItemsOfBins = new Array<any>();

    // loop through the assigned bins from the drag and drop arrays
    this.binToSks.forEach(auditComp => {
      auditComp.bins.forEach((bin: any) => {

        holdItemsOfBins = this.getAssociatedItemsGivenBin(auditComp.sk_location, [bin]);
        if (holdItemsOfBins.length > 0) {

          // determine if bin was previously assigned - patch
          if (this.holdBinIdsOfPreviousAssign.map(obj => obj.Bin).includes(bin)) {

            const getBinId = this.holdBinIdsOfPreviousAssign.
                              filter((obj: any) => obj.Bin === bin).
                              map((obj: any) => obj.bin_id)[0];

            holdBodyPreAuditDataWithBinIDs.push(
              {
                bin_id: getBinId,
                init_audit_id: this.auditID,
                customuser: auditComp.sk_id
              });

          } else {
            // construct array to hold the item ids - post
            holdBodyPreAuditDataWithoutBinIDs.push(
              {
                Bin: bin,
                init_audit: this.auditID,
                customuser: auditComp.sk_id,
                item_ids: holdItemsOfBins.map(item => item.Item_Id),
              });
          }
        }
        // empty array for next bin in loop
        holdItemsOfBins = new Array<any>();
      });
    });

    if (holdBodyPreAuditDataWithoutBinIDs.length > 0) {
      holdBodyPreAuditDataWithoutBinIDs.forEach(bodyPreAuditData => {
        this.manageAuditsService.initiatePreAudit(bodyPreAuditData)
          .subscribe((err) => {
            this.errorMessage = err;
          });
      });
    }

    if (holdBodyPreAuditDataWithBinIDs.length > 0) {
      holdBodyPreAuditDataWithBinIDs.forEach(bodyPreAuditData => {
        this.manageAuditsService.updatePreAudit(bodyPreAuditData.init_audit_id, bodyPreAuditData)
          .subscribe((err) => {
            this.errorMessage = err;
          });
      });
    }

    this.locationsWithBinsAndSKs = [];
    this.binToSks = [];
    this.requestConfirmation = false;

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
      this.requestConfirmation = true;
    }
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

  disableAssign(): boolean {
    // @ts-ignore
    if (this.locationsWithBinsAndSKs.map((obj: any) => obj.bins).flat().length === 0) {

      for (const obj of this.binToSks) {
        if (obj.bins.length === 0) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  // handles page refresh and out-of-app navigation
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any): boolean {
    return confirm('');
  }
}
