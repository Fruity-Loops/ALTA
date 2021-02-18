import { Component, OnInit } from '@angular/core';

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

  public changeListener(files: FileList) {
    console.log(files);
    this.linesR = [];
    if (files && files.length > 0) {
      // tslint:disable-next-line:max-line-length no-non-null-assertion
      const file: File = files.item(0)!; // non null assertion : https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html
      this.locationFileName = file.name;
      // File reader method
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const csv: any = reader.result;
        let allTextLines: any[];
        allTextLines = csv.split(/\r|\n|\r/);

        // Table Rows
        const tarrR = [];

        const arrl = allTextLines.length;
        const rows = [];
        for (let i = 1; i < arrl; i++) {
          rows.push(allTextLines[i].split(';'));
        }

        for (let j = 0; j < arrl; j++) {
          // tslint:disable-next-line:triple-equals
          if (rows[j] != '' && rows[j] !== undefined) {
            tarrR.push(rows[j]);
          }
        }
        // Push rows to array variable
        this.linesR.push(tarrR);
      };
    }
  }

  // A function called by the HTML to be implemented for submitting the org info to the REST API
  abstract submitQuery(): void;
}
