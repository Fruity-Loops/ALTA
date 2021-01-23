import {Component, OnInit} from '@angular/core';

@Component({
  template: ''
})
export abstract class OrganizationViewComponent implements OnInit {

  editOn: boolean; // determines whether editing is on/enabled for the component
  isEdit: boolean; // determines whether the component is capable of editing

  ngOnInit() {
    [this.editOn, this.isEdit] = this.getEditInfo();
  }

  abstract getEditInfo(): [boolean, boolean];

}
