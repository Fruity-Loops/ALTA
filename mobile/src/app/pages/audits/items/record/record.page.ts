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
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.formGroup = this.formBuilder.group({
      id: ['', [Validators.required]],
      Location: ['', [Validators.required]],
      Plant: ['', [Validators.required]],
      Zone: ['', [Validators.required]],
      Aisle: ['', [Validators.required]],
      Bin: ['', [Validators.required]],
      PartNumber: ['', [Validators.required]],
      PartDescription: ['', [Validators.required]],
      SerialNumber: ['', [Validators.required]],
      Condition: ['', [Validators.required]],
      Category: ['', [Validators.required]],
      Owner: ['', [Validators.required]],
      Criticality: ['', [Validators.required]],
      AverageCost: ['', [Validators.required]],
      Quantity: ['', [Validators.required]],
      UnityOfMeasure: ['', [Validators.required]],
    });
  }

}
