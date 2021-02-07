import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Platform, AlertController, ToastController, ModalController } from '@ionic/angular';
import { Subscription, fromEvent } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { fetchLoggedInUser } from 'src/app/services/cache';
import { ActivatedRoute } from '@angular/router';
import { RecordPage } from 'src/app/pages/audits/items/record/record.page';

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
  currentSegment = 'items';
  items: any;
  completedItems: [];
  auditID: string;
  binID: string;

  constructor(
    private auditService: AuditService,
    public toastController: ToastController,
    public alertController: AlertController,
    private cd: ChangeDetectorRef,
    private cameraScanner: BarcodeScanner,
    private androidPermissions: AndroidPermissions,
    public platform: Platform,
    private activatedRoute: ActivatedRoute,
    public modalController: ModalController,
  ) {
    this.barcode = '';
  }

  ngOnInit() {
    this.setPermissions();
    this.getSelectedBin();
    this.getItems();
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

  getItems() {
    fetchLoggedInUser().then(
      user => {
        if (user) {
          this.loggedInUser = user;
          this.auditService.getItems(user.user_id, this.auditID, this.binID).subscribe(
            (res: any) => {
              this.items = res.inventory_items;
            });
        }
      });
  }

  setExternalScanListener() {
    // A Keyboard Event is triggered from an external bluetooth scanner
    this.keypressEvent = fromEvent(document, 'keypress').subscribe(event => {
      this.scanStateChanged(true);
      this.handleKeyboardEvent(event as KeyboardEvent);
    });
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;
    // The last key is always 'Enter'
    if (key === 'Enter') {
      this.finishScan();
    }
    else {
      this.barcode += key;
    }
  }

  handleCameraScan() {
    this.cameraScanner.scan().then(barcodeData => {
      if (barcodeData.cancelled === false) {
        this.barcode = barcodeData.text;
        this.finishScan();
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
          type: 'text',
          placeholder: 'Barcode #'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: input => {
            if (input && input.barcode) {
              this.barcode = input.barcode;
              this.finishScan();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  finishScan() {
    this.validateItem();
    this.barcode = '';
  }

  handleItemClick(itemID) {
    this.barcode = itemID;
    this.validateItem();
  }

  validateItem() {
    this.auditService.checkItem(
      this.loggedInUser.user_id,
      this.auditID,
      this.binID,
      this.barcode).subscribe(
        (item: any) => {
          this.presentRecordModal(item);
          this.scanStateChanged(false);
        });
  }

  scanStateChanged(isScanning: boolean) {
    if (this.isScanning !== isScanning) {
      this.isScanning = isScanning;
      this.cd.detectChanges();
    }
  }

  segmentChanged(ev: CustomEvent) {
    this.currentSegment = ev.detail.value;
  }

  async presentRecordModal(item) {
    this.keypressEvent.unsubscribe();
    const modal = await this.modalController.create({
      component: RecordPage,
      cssClass: 'record-modal',
      showBackdrop: true,
      componentProps: {
        scannedItem: item,
      }
    });
    modal.onDidDismiss()
      .then(() => {
        this.setExternalScanListener();
      });
    return await modal.present();

  }
}
