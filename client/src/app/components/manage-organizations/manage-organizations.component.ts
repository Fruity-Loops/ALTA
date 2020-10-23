import { Component, OnInit } from '@angular/core';
import { ManageOrganizationsService } from 'src/app/services/manage-organizations.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.css']
})
export class ManageOrganizationsComponent implements OnInit {
  organizations = [];
  selectedOrganization;
  errorMessage = '';

  constructor(private organizationsService: ManageOrganizationsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getAllOrganizations();
    this.selectedOrganization = { org_id: -1, org_name: '', status: '' };
    this.errorMessage = '';
  }

  getAllOrganizations(): void {
    this.organizationsService.getAllOrganizations().subscribe(
      (data) => {
         this.organizations = data;
         this.errorMessage = '';
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  organizationClicked(organization): void {
    // console.log(organization.org_id)
    this.organizationsService.getOneOrganization(organization.org_id).subscribe(
      (data) => {
        this.selectedOrganization = data;
        this.errorMessage = '';
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  updateOrganization(): void {
    this.organizationsService.updateOrganization(this.selectedOrganization).subscribe(
      (data) => {
         this.selectedOrganization = data;
         this.getAllOrganizations();
         this.errorMessage = '';
      },
      (err) => {
        this.errorMessage = err.error.org_name;
      }
    );
  }

  createOrganization(): void {
    this.organizationsService.createOrganization(this.selectedOrganization).subscribe(
      (data) => {
        this.organizations.push(data);
        this.errorMessage = '';
      },
      (err) => {
        if(err.error.org_name) {
           this.errorMessage = err.error.org_name;
        }

        if(err.error.detail) {
          this.errorMessage = err.error.detail;
        }
      }
    );
  }

  deleteOrganization(): void {
    this.organizationsService.deleteOrganization(this.selectedOrganization.org_id).subscribe(
      (data) => {
        this.getAllOrganizations();
        this.errorMessage = '';
      },
      (err) => {
        this.errorMessage = err.error.detail;
      }
    );
  }
}
