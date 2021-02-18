import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  template: '',
})
export abstract class OrganizationViewComponent implements OnInit {
  editOn: boolean | undefined; // determines whether editing is on/enabled for the component
  isEdit: boolean | undefined; // determines whether the component is capable of editing
  organizationTitle: string | undefined;

  location: string;
  orgName: string;

  orgError: string | undefined;

  // array varibales to store csv data
  linesR: any[] = []; // for rows
  locationFileName = '';
  locations: string[] = [];

  protected constructor() {
    // Setting defaults, will be changed asynchronously if need be
    [this.location, this.orgName] = ['', ''];
  }

  ngOnInit(): void {
    [this.editOn, this.isEdit] = this.getEditInfo();
    this.organizationTitle = this.getComponentTitle();
  }

  abstract getEditInfo(): [boolean, boolean];

  abstract getComponentTitle(): string;

  submitSave(): void {
    if (this.orgName === '') {
      this.orgError = 'Please enter a name for the organization';
    } else {
      this.submitQuery();
    }
  }

  // tslint:disable-next-line:typedef
  public changeListener(files: FileList) {
    // @ts-ignore
    // tslint:disable-next-line:no-non-null-assertion
    this.locationFileName = files.item(0).name!;
    this.linesR = [];
    const reader = new FileReader();
    // @ts-ignore
    reader.readAsArrayBuffer(files.item(0));
    reader.onload = () => {
      const arrayBuffer = reader.result;
      // @ts-ignore
      const data = new Uint8Array(arrayBuffer);
      const arr = [];
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const workbook = XLSX.read(arr.join(''), {type: 'binary'});
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonFormat = XLSX.utils.sheet_to_json(worksheet, {raw: true, blankrows: false});
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < jsonFormat.length; i++) {
        const tarrR = [];
        // @ts-ignore
        for (const [key, value] of Object.entries(jsonFormat[i])) {
          tarrR.push(value);
        }
        this.linesR.push(tarrR);
      }
    };
  }

  // A function called by the HTML to be implemented for submitting the org info to the REST API
  abstract submitQuery(): void;
}
