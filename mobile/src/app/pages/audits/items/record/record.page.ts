import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuditService } from 'src/app/services/audit.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {
  @Input() modalData: any = {itemData:{}};
  formGroup: FormGroup;
  isItemDetailsHidden = true;

  constructor(
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private auditService: AuditService,
  ) { }

  ngOnInit() {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.formGroup = this.formBuilder.group({
      id: [this.modalData.itemData._id, [Validators.required]],
      Location: [this.modalData.itemData.Location, [Validators.required]],
      Plant: [this.modalData.itemData.Plant, [Validators.required]],
      Zone: [this.modalData.itemData.Zone, [Validators.required]],
      Aisle: [this.modalData.itemData.Aisle, [Validators.required]],
      Bin: [this.modalData.itemData.Bin, [Validators.required]],
      PartNumber: [this.modalData.itemData.Part_Number, [Validators.required]],
      PartDescription: [this.modalData.itemData.Part_Description, [Validators.required]],
      SerialNumber: [this.modalData.itemData.Serial_Number, [Validators.required]],
      Condition: [this.modalData.itemData.Condition, [Validators.required]],
      Category: [this.modalData.itemData.Category, [Validators.required]],
      Owner: [this.modalData.itemData.Owner, [Validators.required]],
      Criticality: [this.modalData.itemData.Criticality, [Validators.required]],
      AverageCost: [this.modalData.itemData.Average_Cost, [Validators.required]],
      Quantity: [this.modalData.itemData.Quantity, [Validators.required]],
      UnitOfMeasure: [this.modalData.itemData.Unit_of_Measure, [Validators.required]],
      status: ['', [Validators.required]],
      comment: ['']

    });
  }

  validate() {
    const record = this.curateData();
    this.auditService.validate(record).subscribe((data: any) => {
      console.log(JSON.stringify(data));
    });
  }

  curateData() {
    const data = this.formGroup.value;
    data.item_id = data.id;
    data.audit = this.modalData.auditID;
    data.bin_to_sk = this.modalData.binID;
    return data;
  }
}
