import {Component, OnInit} from '@angular/core';

@Component({
  template: ''
})
export abstract class OrganizationViewComponent implements OnInit {

  editOn: boolean | undefined; // determines whether editing is on/enabled for the component
  isEdit: boolean | undefined; // determines whether the component is capable of editing
  organizationTitle: string | undefined;

  location: string;
  orgName: string;

  orgError: string | undefined;

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

  // A function called by the HTML to be implemented for submitting the org info to the REST API
  abstract submitQuery(): void;

}
