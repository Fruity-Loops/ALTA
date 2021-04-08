import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  Platform,
  AlertController,
  ToastController,
  ModalController,
  ActionSheetController,
  LoadingController
} from '@ionic/angular';
import { Subscription, fromEvent } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { fetchLoggedInUser } from 'src/app/services/cache';
import { ActivatedRoute, Router } from '@angular/router';
import { RecordPage } from 'src/app/pages/audits/items/record/record.page';

enum Segment {
  ITEMS = 'items',
  COMPLETED_ITEMS = 'completedItems',
}

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit, OnDestroy {
  barcode: string;
  scannedMessage: string;
  keypressEvent: Subscription;
  isScanning: boolean;
  loggedInUser: any;
  Segment = Segment;
  currentSegment = Segment.ITEMS;
  items: any;
  completedItems: any;
  auditID: string;
  binID: string;
  itemsBlankMessage: string;
  completedItemsBlankMessage: string;
  refreshEvent: any;
  dataSetChanged: boolean;


  constructor(
    private auditService: AuditService,
    public toastController: ToastController,
    public alertController: AlertController,
    private cd: ChangeDetectorRef,
    private cameraScanner: BarcodeScanner,
    private androidPermissions: AndroidPermissions,
    public platform: Platform,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    private loadingController: LoadingController
  ) {
    this.barcode = '';
  }

  ngOnInit() {
    this.setPermissions();
    this.getSelectedBin();
    this.getItems(true);
    this.setExternalScanListener();
  }

  ngOnDestroy() {
    this.keypressEvent.unsubscribe();
  }

  setPermissions() {
    if (this.platform.is('android')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => console.log('Has Android Camera Permission?', result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      );
    }
  }

  getSelectedBin() {
    this.auditID = this.activatedRoute.snapshot.paramMap.get('audit_id');
    this.binID = this.activatedRoute.snapshot.paramMap.get('bin_id');
  }

  async getItems(withLoading: boolean, loadingMesage = 'Fetching Items...') {
    const whileLoading = await this.loadingController.create({
      message: loadingMesage
    });
    if (withLoading) {
      await whileLoading.present();
    }

    fetchLoggedInUser().then(
      user => {
        if (user) {
          this.loggedInUser = user;
          this.auditService.getItems(
            user.user_id,
            this.auditID,
            this.binID
          ).subscribe(
            async (res) => {
              await whileLoading.dismiss();
              this.items = res;
              this.itemsBlankMessage = 'There are no items left';
              this.completeRefresh();
            },
            async (res) => {
              this.itemsBlankMessage = 'There was a problem trying to fetch items.';
              await whileLoading.dismiss();
              const alert = await this.alertController.create({
                header: 'Error',
                message: this.itemsBlankMessage,
                buttons: ['Dismiss'],
              });
              this.completeRefresh();
              await alert.present();
            });
        }
      });
  }

  async getCompletedItems(withLoading) {
    const whileLoading = await this.loadingController.create({
      message: 'Fetching Records...'
    });
    if (withLoading) {
      await whileLoading.present();
    }

    fetchLoggedInUser().then(
      user => {
        if (user) {
          this.loggedInUser = user;
          this.auditService.getCompletedItemsBin(
            user.user_id,
            this.auditID,
            this.binID
          ).subscribe(
            async (res) => {
              await whileLoading.dismiss();
              this.completedItemsBlankMessage = 'No item records present';
              this.completedItems = res;
              this.completeRefresh();
            },
            async (res) => {
              this.completedItemsBlankMessage = 'There was a problem trying to fetch completed item records.';
              await whileLoading.dismiss();
              const alert = await this.alertController.create({
                header: 'Error',
                message: this.completedItemsBlankMessage,
                buttons: ['Dismiss'],
              });
              this.completeRefresh();
              await alert.present();
            });
        }
      });
  }

  setExternalScanListener() {
    // A Keyboard Event is triggered from an external bluetooth scanner
    this.keypressEvent = fromEvent(document, 'keypress').subscribe(event => {
      if (this.platform.is('mobile')) {
        this.scanStateChanged(true);
        this.handleKeyboardEvent(event as KeyboardEvent);
      }
    });
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;
    // The last key is always 'Enter'
    if (key === 'Enter') {
      this.validateItem(false, true);
    }
    else {
      this.barcode += key;
    }
  }

  handleCameraScan() {
    this.cameraScanner.scan(
      {
        showTorchButton: true, // iOS and Android
        prompt: `Place a barcode inside the rectangle to scan it. Alternatively, a barcode can also be entered manually.`, // Android
      }
    ).then(barcodeData => {
      if (barcodeData.cancelled === false) {
        this.barcode = barcodeData.text;
        this.validateItem(false, true);
      }
    }).catch(async err => {
      console.log('Camera Scanner Error:', err);
      if (err === 'Illegal access') {
        const toast = await this.toastController.create({
          message: 'Camera Permission Denied',
          duration: 1000,
        });
        toast.present();
      }
    });
  }

  async handleManualInput() {
    const alert = await this.alertController.create({
      header: 'Input Barcode',
      inputs: [
        {
          name: 'barcode',
          type: 'number',
          placeholder: 'Barcode Number'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Confirm',
          handler: input => {
            if (input && input.barcode) {
              this.barcode = input.barcode;
              this.validateItem(false, true);
            }
          }
        }
      ]
    });
    await alert.present();
    alert.onDidDismiss()
      .then(_ => {
        this.isScanning = false;
      });
  }

  terminateScan() {
    this.scanStateChanged(false);
    this.barcode = '';
  }

  handleItemClick(event, itemID, flag) {
    event.preventDefault();
    event.stopPropagation();
    this.barcode = itemID;
    this.validateItem(flag);
  }

  async validateItem(flagged = false, externalInput = false) {
    const whileLoading = await this.loadingController.create();
    if (!this.isScanning) {
      await whileLoading.present();
    }

    const modalData: any = {
      customuser_id: this.loggedInUser.user_id,
      auditID: this.auditID,
      binID: this.binID,
    };

    const itemId = externalInput ? `${this.barcode}_${this.loggedInUser.organization_id}` : this.barcode;

    this.auditService.getItem(
      this.loggedInUser.user_id,
      this.auditID,
      this.binID,
      itemId).subscribe(
        async (res) => {
          await whileLoading.dismiss();
          modalData.itemData = res;
          modalData.itemData.flagged = flagged;
          this.presentRecordModal(modalData);
          this.terminateScan();
        },
        async (res) => {
          const barcode = this.barcode;
          let header = 'No Match';
          let message = `There was no match for #${this.barcode}\n`;

          await whileLoading.dismiss();
          if (res.error?.inAudit) {
            header = 'Item Not Part of Bin';
            message = `This item is part of the current audit but belongs to another bin.`;
          }
          else if (res.error?.alreadyMatched) {
            header = 'Item Record Exists';
            message = `This item has already been submitted for this audit (Record ID: ${res.error.alreadyMatched}).`;
          }
          else {
            const noMatchAlert = await this.alertController.create({
              header,
              message,
              buttons: [
                {
                  text: 'Dismiss',
                }, {
                  text: 'Add as NEW',
                  handler: () => {
                    modalData.itemData = {
                      item_id: `${barcode}_${this.loggedInUser.organization_id}`,
                      Batch_Number: barcode,
                      status: 'New',
                      Quantity: 0, // expected quantity was 0
                      flagged: true
                    };
                    this.presentRecordModal(modalData);
                  }
                },
                {
                  text: 'Input Barcode',
                  handler: () => this.handleManualInput(),
                },
              ]
            });
            await noMatchAlert.present();
            this.terminateScan();
            return;
          }
          const alert = await this.alertController.create({
            header,
            message,
            buttons: ['Dismiss']
          });
          await alert.present();
          this.terminateScan();
        });
  }


  async getRecord(recordID) {
    this.auditService.getRecord(
      this.loggedInUser.user_id,
      this.auditID,
      this.binID,
      recordID).subscribe(
        (record: any) => {
          const modalData = {
            itemData: record,
            customuser_id: this.loggedInUser.user_id,
            auditID: this.auditID,
            binID: this.binID,
          };
          this.presentRecordModal(modalData);
        });
  }

  async deleteRecord(recordID) {
    const whileLoading = await this.loadingController.create();
    await whileLoading.present();

    this.auditService.deleteRecord(recordID).subscribe(
      async (res) => {
        await whileLoading.dismiss();
        this.doRefresh(null);
        this.notifyDataSetChanged(true);
        const alert = await this.alertController.create({
          header: 'Record Removed',
          message: 'The record has been successfully removed.',
          buttons: ['Dismiss'],
        });
        await alert.present();
      },
      async (res) => {
        await whileLoading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'There was a problem removing this record.',
          buttons: ['Dismiss'],
        });
        await alert.present();
      });
  }


  async presentDeleteRecordAlert(recordID) {
    const alert = await this.alertController.create({
      header: 'Remove Record ?',
      message: 'Are you sure you want to remove this record ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Remove',
          handler: () => {
            this.deleteRecord(recordID);
          }
        }
      ]
    });
    await alert.present();
  }


  scanStateChanged(isScanning: boolean) {
    if (this.isScanning !== isScanning) {
      this.isScanning = isScanning;
      this.cd.detectChanges();
    }
  }

  segmentChanged(ev: CustomEvent) {
    this.currentSegment = ev.detail.value;

    if (this.currentSegment === Segment.ITEMS && (!this.items || this.dataSetChanged)) {
      this.getItems(true);
      this.notifyDataSetChanged(false);
    }
    else if (this.currentSegment === Segment.COMPLETED_ITEMS && (!this.completedItems || this.dataSetChanged)) {
      this.getCompletedItems(true);
      this.notifyDataSetChanged(false);
    }
  }

  async presentRecordModal(data) {
    this.keypressEvent.unsubscribe();
    const modal = await this.modalController.create({
      component: RecordPage,
      cssClass: 'record-modal',
      showBackdrop: true,
      componentProps: {
        modalData: data,
      }
    });
    modal.onDidDismiss()
      .then((res) => {
        if (res.data?.itemValidated) {
          this.doRefresh(null);
          this.notifyDataSetChanged(true);
        }
        this.setExternalScanListener();
      });
    return await modal.present();
  }

  async doRefresh(event) {
    this.refreshEvent = event;
    if (this.currentSegment === Segment.COMPLETED_ITEMS) {
      this.getCompletedItems(false);
    }
    else if (this.currentSegment === Segment.ITEMS) {
      this.getItems(false);
    }
  }

  async completeRefresh() {
    if (this.refreshEvent) {
      this.refreshEvent.target.complete();
      this.refreshEvent = null;
    }
  }

  notifyDataSetChanged(dataSetChanged: boolean) {
    this.dataSetChanged = dataSetChanged;
  }

  async presentCompltedItemActionSheet(recordID) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            this.getRecord(recordID);
          }
        }, {
          text: 'Remove',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.presentDeleteRecordAlert(recordID);
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        }]
    });
    await actionSheet.present();
  }

  async completeBin() {
    const alert = await this.alertController.create({
      header: 'Complete Bin ?',
      message: 'Are you sure you want to complete this bin ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Complete',
          handler: async () => {
            const isBinValid = await this.validateBin();
            if (isBinValid) {
              this.auditService.completeBin(
                this.loggedInUser.user_id,
                this.auditID,
                this.binID,
                'Complete').subscribe(
                  async (res) => {
                    const successAlert = await this.alertController.create({
                      header: 'Bin Completed',
                      message: 'The bin has been successfully completed.',
                      buttons: ['Dismiss'],
                    });
                    await successAlert.present();
                    successAlert.onDidDismiss()
                      .then(_ => {
                        this.router.navigate([`/audits/${this.auditID}`], {
                          state: { data: { segment: 'completedBins' } }
                        });
                      });
                  },
                  async (res) => {
                    const errorAlert = await this.alertController.create({
                      header: 'Error',
                      message: 'There was a problem trying to complete this bin.',
                      buttons: ['Dismiss'],
                    });
                    await errorAlert.present();
                  });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async validateBin(): Promise<boolean> {
    await this.getItems(true, 'Validating Items...');
    if (this.items?.length > 0) {
      const cannotCompleteAlert = await this.alertController.create({
        header: 'Cannot Complete Bin',
        message: `This bin cannot currently be completed as there are still items(${this.items?.length}) left to audit.`,
        buttons: ['Dismiss'],
      });
      await cannotCompleteAlert.present();
      return false;
    }
    return true;
  }
}
