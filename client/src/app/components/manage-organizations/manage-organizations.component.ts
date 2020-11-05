import { Component, OnInit } from '@angular/core';
import { ManageOrganizationsService } from 'src/app/services/manage-organizations.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { Organization } from '../../models/organization';


@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.scss'],
})
export class ManageOrganizationsComponent implements OnInit {
  organizations = [];
  selectedOrganization;
  errorMessage = '';

  dataSource: MatTableDataSource<Organization>;
  displayedColumns: string[] = ['1', 'Company_name', 'Activated_On', 'Status', 'Address', '2'];
  filterTerm: string;
  selected = 'All';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private organizationsService: ManageOrganizationsService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getAllOrganizations();
    this.selectedOrganization = { org_id: -1, org_name: '', status: '' };
    this.errorMessage = '';
  }

  getAllOrganizations(): void {
    this.organizationsService.getAllOrganizations().subscribe(
      (data) => {
        this.organizations = data;
        console.log(data);
        this.errorMessage = '';
        this.dataSource = new MatTableDataSource(this.organizations);
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  organizationClicked(organization): void {
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
        if (err.error.org_name) {
          this.errorMessage = err.error.org_name;
        }

        if (err.error.detail) {
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

  applyFilter(filterTerm: string): void {
    this.dataSource.filter = filterTerm;
  }
}
