import { Component, OnInit, HostListener } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.page.html',
  styleUrls: ['./audits.page.scss'],
})
export class AuditsPage implements OnInit {
  barcode: string;
  scannedMessage: string;

  constructor(public toastController: ToastController) {
    this.barcode = '';
  }

  ngOnInit() {
  }

  @HostListener('document:keypress', ['$event'])
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
