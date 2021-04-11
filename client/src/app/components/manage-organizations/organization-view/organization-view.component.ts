import {Component, OnInit} from '@angular/core';
import * as XLSX from 'xlsx';
import {OrganizationViewLangFactory, OrgViewActionButtons, OrgViewLabels, OrgViewPlaceholders} from './organization-view.language';


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

  // array variables to store csv data
  linesR: any[] = []; // for rows
  locationFileName = '';
  locations: string[] = [];

  fieldLabels: OrgViewLabels;
  fieldPlaceholders: OrgViewPlaceholders;
  actionButtons: OrgViewActionButtons;

  protected constructor() {
    // Setting defaults, will be changed asynchronously if need be
    [this.location, this.orgName] = ['', ''];
    const lang = new OrganizationViewLangFactory();
    [this.fieldLabels, this.fieldPlaceholders, this.actionButtons] = [lang.lang.fieldLabels, lang.lang.fieldPlaceholders,
      lang.lang.actionButtons];
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

  locationInputOrFile(): void {
    if (this.linesR.length > 0 && this.location === '') { // If only Excel file is uploaded with a list of location.
      this.populateExcelElem();
    } else if (this.linesR.length > 0 && this.location !== '') { // If Excel file is uploaded and list of location is manually entered.
      this.populateExcelElem();
      this.populateUserInputElem();
    } else if (this.linesR.length === 0 && this.location !== '') { // If only list of location is manually entered.
      this.populateUserInputElem();
    }
  }

  populateExcelElem(): void {
    for (const elem of this.linesR) {
      this.locations.push(elem);
    }
  }

  populateUserInputElem(): void {
    const locArr = this.location.split(',');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < locArr.length; i += 2) {
      if (i !== locArr.length - 1) {
        const tempArr = [];
        tempArr.push(locArr[i]);
        tempArr.push(locArr[i + 1]);
        // @ts-ignore
        this.locations.push(tempArr);
      }
    }
  }

  // tslint:disable-next-line:typedef
  public readFromExcelFile(files: FileList) {
    // @ts-ignore
    this.locationFileName = files.item(0).name;
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
      jsonFormat.forEach(item => {
        const tarrR = [];
        // @ts-ignore
        for (const value of Object.values(item)) {
          tarrR.push(value);
        }
        this.linesR.push(tarrR);
      });
    };
  }

  // A function called by the HTML to be implemented for submitting the org info to the REST API
  abstract submitQuery(): void;
}
