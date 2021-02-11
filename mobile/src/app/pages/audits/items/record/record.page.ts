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
  modalTitle = 'Item';
  lastModifiedOn: string;
  isItemDetailsHidden = true;

  constructor(
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private auditService: AuditService,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.setRecordData();
    this.buildLoginForm();
  }

  setRecordData() {
    this.recordID = this.modalData.itemData.record_id;
    if (this.recordID) {
      // Record(completed item) passed
      this.modalTitle = `Editing Record ${this.recordID}`;
      this.lastModifiedOn = this.modalData.itemData.last_verified_on;
    }
  }

  buildLoginForm() {
    this.formGroup = this.formBuilder.group({
      item_id: [this.modalData.itemData._id || this.modalData.itemData.item_id, [Validators.required]],
      Location: [this.modalData.itemData.Location, [Validators.required]],
      Plant: [this.modalData.itemData.Plant, [Validators.required]],
      Zone: [this.modalData.itemData.Zone, [Validators.required]],
      Aisle: [this.modalData.itemData.Aisle, [Validators.required]],
      Bin: [this.modalData.itemData.Bin, [Validators.required]],
      Part_Number: [this.modalData.itemData.Part_Number, [Validators.required]],
      Part_Description: [this.modalData.itemData.Part_Description, [Validators.required]],
      Serial_Number: [this.modalData.itemData.Serial_Number, [Validators.required]],
      Condition: [this.modalData.itemData.Condition, [Validators.required]],
      Category: [this.modalData.itemData.Category, [Validators.required]],
      Owner: [this.modalData.itemData.Owner, [Validators.required]],
      Criticality: [this.modalData.itemData.Criticality, [Validators.required]],
      Average_Cost: [this.modalData.itemData.Average_Cost, [Validators.required]],
      Quantity: [this.modalData.itemData.Quantity, [Validators.required]],
      Unit_of_Measure: [this.modalData.itemData.Unit_of_Measure, [Validators.required]],
      status: [this.modalData.itemData.status, [Validators.required]],
      flagged: [this.modalData.itemData.flagged],
      comment: [this.modalData.itemData.comment || '']

    });
  }

  submit() {
    if (this.recordID) {
      return this.patch();
    }
    return this.validate();
  }

  async validate() {
    const whileLoading = await this.loadingController.create();
    await whileLoading.present();

    const record = this.curateData();
    console.log(JSON.stringify(record))
    this.auditService.createRecord(record).subscribe(
      async (res) => {
        await whileLoading.dismiss();
        const alert = await this.alertController.create({
          header: 'Item Validated',
          message: 'The item has been successfully submitted.',
          buttons: ['Dismiss'],
        });
        await alert.present().then(_ => {
          this.dismissModal();
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

  async patch() {
    const whileLoading = await this.loadingController.create();
    await whileLoading.present();

    const record = this.curateData();
    this.auditService.patchRecord(this.recordID, record).subscribe(
      async (res) => {
        await whileLoading.dismiss();
        const alert = await this.alertController.create({
          header: 'Record Validated',
          message: 'The record has been successfully modifed.',
          buttons: ['Dismiss'],
        });
        await alert.present().then(_ => {
          this.dismissModal();
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
    console.log(JSON.stringify(data));
    data.audit = this.modalData.auditID;
    data.bin_to_sk = this.modalData.binID;
    if (!data.flagged){
      data.flagged = false;
    }
    console.log(data.flagged)
    return data;
  }

  dismissModal() {
    this.modalController.dismiss({
      itemValidated: true,
    });
  }

}
