import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.page.html',
  styleUrls: ['./audits.page.scss'],
})
export class AuditsPage implements OnInit {
  barcode: string;
  scannedMessage: string;
  keypressEvent: Subscription;



  constructor(public toastController: ToastController) {
    this.barcode = '';
  }

  ngOnInit() {
    this.keypressEvent = fromEvent(document, 'keypress').subscribe(event => {
      this.handleKeyboardEvent(event as KeyboardEvent);
    })
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
    }
    else {
      this.barcode += key;
    }
  }

  async presentScanSuccessToast() {
    const toast = await this.toastController.create({
      message: this.scannedMessage,
      duration: 4000
    });
    toast.present();
  }
}
