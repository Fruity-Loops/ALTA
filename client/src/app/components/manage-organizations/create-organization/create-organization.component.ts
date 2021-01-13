import { Component, OnInit } from '@angular/core';
import {ManageOrganizationsService} from '../../../services/manage-organizations.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class CreateOrganizationComponent implements OnInit {

  activeStates = ['Active', 'Disabled'];
  orgName: string;
  location: string;
  isEdit = false;
  organizationTitle = 'Organization Creation';
  isActive = '';

  editOn = true; // never changes

  constructor(
    private organizationService: ManageOrganizationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.orgName = '';
    this.location = '';
  }

  submitSave(): void {
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
