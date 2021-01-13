import {Component, Inject, Input, OnInit, Optional, TemplateRef} from '@angular/core';
import {ManageOrganizationsService} from 'src/app/services/manage-organizations.service';

import {AuthService} from '../../services/auth.service';
import {FormBuilder, NgForm} from '@angular/forms';
import {ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Organization} from '../../models/organization';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

interface DialogData {
  textInput: string;
  placeholder: string;
  title: string;
  buttonDesc: string;
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
  orgEdit;

  constructor(
    private organizationsService: ManageOrganizationsService,
    private fb: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
  }

  dataSource: MatTableDataSource<Organization>;
  displayedColumns: string[] = ['Company_name', 'Activated_On', 'Status', 'Address', '2'];
  filterTerm: string;
  selected = 'All';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('updateOrgDialog') updateOrgDialog: TemplateRef<any>;
  @ViewChild('createOrgDialog') createOrgDialog: TemplateRef<any>;

  @Input() isActive: string;
  activeStates = [{status: 'active'}, {status: 'disabled'}];

  ngOnInit(): void {
    this.getAllOrganizations();
    this.selectedOrganization = {org_id: -1, org_name: '', status: ''};
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

  preventPropagation(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  openUpdateOrgDialog(organization): void {
    this.selectedOrganization = organization;
    this.isActive = organization.status ? 'active' : 'disabled';
    const dialogRef = this.dialog.open(this.updateOrgDialog);
  }

  onSubmitUpdateOrg(form: NgForm): void {
    if (form.status !== 'INVALID') {
      const orgStatus = form.value.status === 'active' ? true : false;
      this.updateOrganization({
        org_id: this.selectedOrganization.org_id,
        org_name: form.value.name,
        address: form.value.address,
        status: orgStatus
      });
      this.dialog.closeAll();
    }
  }


  createOrganization(organization): void {
    this.organizationsService.createOrganization(organization).subscribe(
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

  openCreateDialog(): void {
    this.dialog.open(this.createOrgDialog);
  }

  onSubmitCreateOrg(form: NgForm): void {
    if (form.status !== 'INVALID') {
      this.createOrganization({
        org_name: form.value.name,
        address: form.value.address,
        status: true
      });
      this.dialog.closeAll();
    }
  }

  turnOnOrgMode(organization): void {
    this.authService.turnOnOrgMode({organization: organization.org_id, organization_name: organization.org_name}, true);
  }


  applyFilter(filterTerm: string): void {
    this.dataSource.filter = filterTerm;
  }
}


@Component({
  selector: 'app-organization-dialog',
  templateUrl: 'organization-dialog.html',
})
export class OrganizationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<OrganizationDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

}
