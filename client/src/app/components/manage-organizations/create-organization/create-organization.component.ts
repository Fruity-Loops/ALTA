import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss']
})
export class CreateOrganizationComponent implements OnInit {

  activeStates = ["active", "disabled"];

  constructor() { }

  ngOnInit(): void {
  }

}
