import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subscription, fromEvent } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { Audit } from 'src/app/models/audit';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.page.html',
  styleUrls: ['./audits.page.scss'],
})
export class AuditsPage implements OnInit {
  barcode: string;
  scannedMessage: string;
  keypressEvent: Subscription;
  audits: Array<Audit>;
  isScanning: boolean;

  constructor(
    private auditService: AuditService,
    public toastController: ToastController,
    public alertController: AlertController,
    private cd: ChangeDetectorRef,
    private cameraScanner: BarcodeScanner,
  ) {
    this.barcode = '';
  }

  ngOnInit() {
    this.setExternalScanListener();
    this.getAudits();
  }

  getAudits() {
    // Fetch audits assigned to the stock keeper
    // TODO: replace with backend request
    this.audits = [
      <Audit>{ id: '711719047308', name: 'item0' },
      <Audit>{ id: '056394400360', name: 'item1' },
      <Audit>{ id: '06240021360', name: 'item2' },
      <Audit>{ id: 'X002DW4WYJ', name: 'item3' },
      <Audit>{ id: '71810326785 ', name: 'item4' },
      <Audit>{ id: '057800056621', name: 'item5' },
      <Audit>{ id: '068100084245 ', name: 'item6' },
      <Audit>{ id: '521910642751', name: 'item7' },
      <Audit>{ id: '831956442012 ', name: 'item8' },
    ];
    // this.auditService.getAudits().subscribe(res => {
    //   this.audits = res;
    // });
  }

  ngOnDestroy() {
    this.keypressEvent.unsubscribe();
  }

  setExternalScanListener() {
    // A Keyboard Event is triggered from an external bluetooth scanner
    this.keypressEvent = fromEvent(document, 'keypress').subscribe(event => {
      this.scanStateChanged(true);
      this.handleKeyboardEvent(event as KeyboardEvent);
    });
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    let key = event.key;
    // The last key is always 'Enter'
    if (key == 'Enter') {
      this.finishScan();
    }
    else {
      this.barcode += key;
    }
  }

  handleCameraScan() {
    this.cameraScanner.scan().then(barcodeData => {
      if (barcodeData.cancelled == false) {
        this.barcode = barcodeData.text;
        this.finishScan();
      }
    }).catch(err => {
      console.log('Error while scanning using camera:', err);
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
      if (audit.id == this.barcode) {
        this.scannedMessage = `Scanned bardcode #${this.barcode}\nMatch with ${audit.name} !`
      }
    });
  }

  scanStateChanged(isScanning: boolean) {
    if (this.isScanning != isScanning) {
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
