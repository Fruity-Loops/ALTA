import { Component, OnInit } from '@angular/core';
import {ManageOrganizationsService} from '../../../services/manage-organizations.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss']
})
export class CreateOrganizationComponent implements OnInit {

  activeStates = ["active", "disabled"];
  orgName: string;
  location: string;

  constructor(
    private organizationService: ManageOrganizationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.orgName = '';
    this.location = '';
  }

  submitSave() {
    this.organizationService.createOrganization({
      org_name: this.orgName,
      address: this.location,
      status: true
    }).subscribe(() => {
      setTimeout(() => {
        // Redirect user back to list of templates
        this.router.navigate(['/manage-organizations']);
      }, 1000);
    });
  }

}
