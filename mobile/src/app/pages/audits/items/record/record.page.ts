import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuditService } from 'src/app/services/audit.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {
  @Input() modalData: any = { itemData: {} };
  formGroup: FormGroup;
  recordID: number;
  modalTitle: string;
  lastModifiedOn: string;
  submitButton = 'SUBMIT';
  isItemDetailsHidden = true;
  expectedQuantity;

  constructor(
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private auditService: AuditService,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.setRecordData();
    this.buildForm();
  }

  setRecordData() {
    this.recordID = this.modalData.itemData.record_id;
    if (this.recordID) {
      // Record(completed item) passed
      this.modalTitle = `Editing Record ${this.recordID}`;
      this.lastModifiedOn = this.modalData.itemData.last_verified_on;
    }
    else {
      this.modalTitle = 'Found Item';
    }
  }

  buildForm() {
    this.expectedQuantity = this.modalData.itemData.Quantity;
    this.modalData.itemData.Quantity = this.expectedQuantity !== 0 ? this.modalData.itemData.Quantity : '';
    this.formGroup = this.formBuilder.group({
      item_id: [this.modalData.itemData.Item_Id || this.modalData.itemData.item_id, [Validators.required]],
      Batch_Number: [this.modalData.itemData.Batch_Number],
      Location: [this.modalData.itemData.Location],
      Plant: [this.modalData.itemData.Plant],
      Zone: [this.modalData.itemData.Zone],
      Aisle: [this.modalData.itemData.Aisle],
      Bin: [this.modalData.itemData.Bin],
      Part_Number: [this.modalData.itemData.Part_Number],
      Part_Description: [this.modalData.itemData.Part_Description],
      Serial_Number: [this.modalData.itemData.Serial_Number],
      Condition: [this.modalData.itemData.Condition],
      Category: [this.modalData.itemData.Category],
      Owner: [this.modalData.itemData.Owner],
      Criticality: [this.modalData.itemData.Criticality],
      Average_Cost: [this.modalData.itemData.Average_Cost],
      Quantity: [this.modalData.itemData.Quantity, [Validators.required]],
      Unit_of_Measure: [this.modalData.itemData.Unit_of_Measure],
      flagged: [this.modalData.itemData.flagged],
      comment: [this.modalData.itemData.comment || '']

    });
  }

  submit() {
    if (this.recordID) {
      return this.patchRecord();
    }
    return this.validateItem();
  }

  async validateItem() {
    const whileLoading = await this.loadingController.create();
    await whileLoading.present();

    const record = this.curateData();
    this.auditService.createRecord(record).subscribe(
      async (res) => {
        await whileLoading.dismiss();
        const alert = await this.alertController.create({
          header: 'Item Validated',
          message: 'The item has been successfully submitted.',
          buttons: ['Dismiss'],
        });
        await alert.present().then(_ => {
          this.dismissModal(true);
        });
      },
      async (res) => {
        await whileLoading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'There was a problem validating this item.',
          buttons: ['Dismiss'],
        });
        await alert.present();
      });

  }

  async patchRecord() {
    const whileLoading = await this.loadingController.create();
    await whileLoading.present();

    const record = this.curateData();
    this.auditService.patchRecord(this.recordID, record).subscribe(
      async (res) => {
        await whileLoading.dismiss();
        const alert = await this.alertController.create({
          header: 'Record Modified',
          message: 'The record has been successfully modifed.',
          buttons: ['Dismiss'],
        });
        await alert.present().then(_ => {
          this.dismissModal(true);
        });
      },
      async (res) => {
        await whileLoading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'There was a problem modifying this record.',
          buttons: ['Dismiss'],
        });
        await alert.present();
      });
  }

  curateData() {
    const data = this.formGroup.value;
    data.audit = this.modalData.auditID;
    data.bin_to_sk = this.modalData.binID;
    if (!data.flagged) {
      data.flagged = false;
    }

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] === null) {
          data[key] = 'N/A';
          if (key === 'Aisle') {
            data[key] = 0;
          }
          else if (key === 'comment') {
            data[key] = '';
          }
        }
      }
    }

    if (typeof data.Quantity === 'boolean') {
      data.Quantity = data.Quantity ? 1 : 0;
    }
    if (data.Quantity === this.expectedQuantity) { data.status = 'Provided'; }
    else if (data.Quantity < this.expectedQuantity) { data.status = 'Missing'; }
    else if (data.Quantity > this.expectedQuantity) { data.status = 'New'; }

    return data;
  }

  dismissModal(isItemValid: boolean) {
    this.modalController.dismiss({
      itemValidated: isItemValid,
    });
  }

}
