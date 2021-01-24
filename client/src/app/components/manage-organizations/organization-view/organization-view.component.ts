import {Component, OnInit} from '@angular/core';

@Component({
  template: ''
})
export abstract class OrganizationViewComponent implements OnInit {

  editOn: boolean; // determines whether editing is on/enabled for the component
  isEdit: boolean; // determines whether the component is capable of editing
  organizationTitle: string;

  location: string;
  orgName: string;

  orgError: string;

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

  // A function called by the HTML to be implemented for submitting the org info to the REST API
  abstract submitSave(): void;

}
