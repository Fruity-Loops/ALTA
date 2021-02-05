import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {
  @Input() scannedItem: any = {};
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(JSON.stringify(this.scannedItem));
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.formGroup = this.formBuilder.group({
      id: [this.scannedItem._id, [Validators.required]],
      Location: [this.scannedItem.Location, [Validators.required]],
      Plant: [this.scannedItem.Plant, [Validators.required]],
      Zone: [this.scannedItem.Zone, [Validators.required]],
      Aisle: [this.scannedItem.Aisle, [Validators.required]],
      Bin: [this.scannedItem.Bin, [Validators.required]],
      PartNumber: [this.scannedItem.Part_Number, [Validators.required]],
      PartDescription: [this.scannedItem.Part_Description, [Validators.required]],
      SerialNumber: [this.scannedItem.Serial_Number, [Validators.required]],
      Condition: [this.scannedItem.Condition, [Validators.required]],
      Category: [this.scannedItem.Category, [Validators.required]],
      Owner: [this.scannedItem.Owner, [Validators.required]],
      Criticality: [this.scannedItem.Criticality, [Validators.required]],
      AverageCost: [this.scannedItem.Average_Cost, [Validators.required]],
      Quantity: [this.scannedItem.Quantity, [Validators.required]],
      UnitOfMeasure: [this.scannedItem.Unit_of_Measure, [Validators.required]],
    });
  }

  validate() {
    console.log(JSON.stringify(this.formGroup.value));
  }
}
