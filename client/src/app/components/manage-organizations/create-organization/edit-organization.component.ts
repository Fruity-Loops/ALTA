import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-edit-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class EditOrganizationComponent implements OnInit {

  isActive = 'Active';
  activeStates = ["Active", "Disabled"];
  isEdit = true;
  organizationTitle = 'Organization Profile';

  constructor() {
  }

  ngOnInit() {
  }
}
