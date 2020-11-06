import {Component, Inject, OnInit, Optional} from '@angular/core';
import { ManageOrganizationsService } from 'src/app/services/manage-organizations.service';

import {AuthService} from '../../services/auth.service';
import { FormBuilder } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Organization } from '../../models/organization';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  textInput: string,
  placeholder: string,
  title: string,
  buttonDesc: string
}

@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.scss'],
})
export class ManageOrganizationsComponent implements OnInit {
  organizations = [];
  selectedOrganization;
  errorMessage = '';

  constructor(private organizationsService: ManageOrganizationsService,
              private fb: FormBuilder,
              private authService: AuthService,
              public dialog: MatDialog) {}
  dataSource: MatTableDataSource<Organization>;
  displayedColumns: string[] = ['1', 'Company_name', 'Activated_On', 'Status', 'Address', '2'];
  filterTerm: string;
  selected = 'All';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  updateOrganization(organization): void {
    this.organizationsService.updateOrganization(organization).subscribe(
      (data) => {
        this.getAllOrganizations();
        this.errorMessage = '';
      },
      (err) => {
        this.errorMessage = err.error.org_name;
      }
    );
  }

  openUpdateOrgDialog(organization): void {
    console.log(organization);
    const dialogRef = this.dialog.open(OrganizationDialog, {
      width: '250px',
      data: {
        textInput: organization.org_name,
        placeholder: 'Edit Organization',
        title: 'Edit Organization',
        buttonDesc: 'Update'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== organization.org_name) {
        this.updateOrganization({...organization, org_name: result});
      }
    });
  }

  createOrganization(orgName: string): void {
    this.organizationsService.createOrganization({org_name: orgName}).subscribe(
      (data) => {
        this.organizations.push(data);
        this.getAllOrganizations();
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

  deleteOrganization(organization): void {
    // this.organizationsService.deleteOrganization(this.selectedOrganization.org_id).subscribe(
    //   (data) => {
    //     this.getAllOrganizations();
    //     this.errorMessage = '';
    //   },
    //   (err) => {
    //     this.errorMessage = err.error.detail;
    //   }
    // );
    console.log(organization);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(OrganizationDialog, {
      width: '250px',
      data: {
        textInput: '',
        placeholder: 'Enter Organization',
        title: 'Organization',
        buttonDesc: 'Create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createOrganization(result);
      }
    });
  }

  turnOnOrgMode(organization): void {
    this.authService.turnOnOrgMode(organization.org_id);
  }


  applyFilter(filterTerm: string): void {
    this.dataSource.filter = filterTerm;
  }
}


@Component({
  selector: 'organization-dialog',
  templateUrl: 'organization-dialog.html',
})
export class OrganizationDialog {

  constructor(
    public dialogRef: MatDialogRef<OrganizationDialog>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

}
