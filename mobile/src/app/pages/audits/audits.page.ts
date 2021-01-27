import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { Subscription, fromEvent } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { fetchLoggedInUser } from 'src/app/services/cache';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.page.html',
  styleUrls: ['./audits.page.scss'],
})
export class AuditsPage implements OnInit, OnDestroy {
  barcode: string;
  scannedMessage: string;
  keypressEvent: Subscription;
  audits: Array<any>;
  isScanning: boolean;
  loggedInUser: any;

  constructor(
    private auditService: AuditService,
    public toastController: ToastController,
    public alertController: AlertController,
    private cd: ChangeDetectorRef,
    private cameraScanner: BarcodeScanner,
    private androidPermissions: AndroidPermissions,
    public platform: Platform,
  ) {
    this.barcode = '';
  }

  ngOnInit() {
    this.setPermissions();
    this.getAudits();
    this.setExternalScanListener();
  }

  getAudits() {
    fetchLoggedInUser().then(
      user => {
        this.loggedInUser = user;
        this.auditService.getAudits(this.loggedInUser.user_id).subscribe(
          res => {
            this.audits = res;
          });
      });
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
    this.presentScanSuccessToast();
    this.scanStateChanged(false);
  }

  validateItem() {
    // Check if the scanned barcode matches an item
    // TODO: replace with backend request
    this.scannedMessage = `Scanned bardcode #${this.barcode}\nNo item match found.`;
    this.audits.forEach(audit => {
      if (audit.id === this.barcode) {
        this.scannedMessage = `Scanned bardcode #${this.barcode}\nMatch with ${audit.name} !`;
      }
    });
  }

  scanStateChanged(isScanning: boolean) {
    if (this.isScanning !== isScanning) {
      this.isScanning = isScanning;
      this.cd.detectChanges();
    }
  }

  async presentScanSuccessToast() {
    const toast = await this.toastController.create({
      message: this.scannedMessage,
      duration: 4000,
      position: 'bottom',
    });
    toast.present();
  }
}
