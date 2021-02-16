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
  locations: string[] = [];

  orgError: string | undefined;

  csvRecords: any[] = [];
  header = false;
  //array varibales to store csv data
  linesR: any[] = []; // for rows

  protected constructor() {
    // Setting defaults, will be changed asynchronously if need be
    [this.location, this.orgName] = ['', ''];
  }

  // @ViewChild('fileImportInput', { static: false }) fileImportInput: any;

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
    if (files && files.length > 0) {
      let file: File = files.item(0)!; // non null assertion : https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html
      console.log(file.name);
      console.log(file.size);
      console.log(file.type);
      //File reader method
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        let csv: any = reader.result;
        let allTextLines = [];
        allTextLines = csv.split(/\r|\n|\r/);

        // Table Rows
        var tarrR = [];

        let arrl = allTextLines.length;
        let rows = [];
        for (let i = 1; i < arrl; i++) {
          rows.push(allTextLines[i].split(';'));
        }

        for (let j = 0; j < arrl; j++) {
          if (rows[j] != '' && rows[j] !== undefined) {
            tarrR.push(rows[j]);
          }
        }
        //Push rows to array variable
        this.linesR.push(tarrR);
      };
      console.log(this.linesR);
    }
  }

  // A function called by the HTML to be implemented for submitting the org info to the REST API
  abstract submitQuery(): void;
}
