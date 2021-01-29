import { Component, OnInit } from '@angular/core';
import {ManageOrganizationsService} from '../../../services/manage-organizations.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class CreateOrganizationComponent implements OnInit {

  orgName: string;
  location: string;
  isEdit: boolean;
  organizationTitle: string;
  orgError: string;

  editOn: boolean;

  constructor(
    private organizationService: ManageOrganizationsService,
    private router: Router
  ) {
    this.orgName = '';
    this.location = '';
    this.orgError = '';
    this.organizationTitle = 'Organization Creation';
    this.isEdit = false;
    this.editOn = true; // never changes
  }

  ngOnInit(): void {
  }

  submitSave(): void {
    this.organizationService.createOrganization({
      org_name: this.orgName,
      address: this.location !== '' ? this.location : undefined,
      status: true
    }).subscribe(() => {
      setTimeout(() => {
        // Redirect user back to list of templates
        this.router.navigate(['/manage-organizations']);
      }, 1000);
    }, err => {
      if (err.error && err.error.org_name) {
        this.orgError = 'An organization with this name already exists';
      }
    });
  }

}
