import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subscription, fromEvent } from 'rxjs';
import { AuditService } from 'src/app/services/audit.service';
import { Audit } from 'src/app/models/audit';
import { LoadingController } from '@ionic/angular';

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
    private loadingController: LoadingController,
    private cd: ChangeDetectorRef
  ) {
    this.barcode = '';
  }

  ngOnInit() {
    this.keypressEvent = fromEvent(document, 'keypress').subscribe(event => {
      this.scanStateChanged(true);
      this.handleKeyboardEvent(event as KeyboardEvent);
    });

    this.getAudits();
  }

  getAudits() {
    // Dummy list simulating fetch
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

  handleKeyboardEvent(event: KeyboardEvent) {
    let key = event.key;
    if (key == 'Enter') {
      this.scannedMessage = `Scanned bardcode #${this.barcode}`;
      this.barcode = '';
      this.presentScanSuccessToast();
      this.scanStateChanged(false);
    }
    else {
      this.barcode += key;
    }
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
      duration: 2000,
    });
    toast.present();
  }

}
