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
  isItemDetailsHidden = true;

  constructor(
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private auditService: AuditService,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.formGroup = this.formBuilder.group({
      item_id: [this.modalData.itemData._id, [Validators.required]],
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
      status: ['', [Validators.required]],
      comment: ['']

    });
  }

  async validate() {
    const whileLoading = await this.loadingController.create();
    await whileLoading.present();

    const record = this.curateData();
    this.auditService.validate(record).subscribe(
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
      })

  }

  curateData() {
    const data = this.formGroup.value;
    data.audit = this.modalData.auditID;
    data.bin_to_sk = this.modalData.binID;
    return data;
  }

  dismissModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
