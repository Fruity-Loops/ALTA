import {Component, OnInit} from '@angular/core';

@Component({
  template: ''
})
export abstract class OrganizationViewComponent implements OnInit {

  editOn: boolean; // determines whether editing is on/enabled for the component
  isEdit: boolean; // determines whether the component is capable of editing
  organizationTitle: string;

  ngOnInit() {
    [this.editOn, this.isEdit] = this.getEditInfo();
    this.organizationTitle = this.getComponentTitle();
  }

  abstract getEditInfo(): [boolean, boolean];

  abstract getComponentTitle(): string;

}
