import {Component, Inject, Input, OnInit, Optional, TemplateRef} from '@angular/core';
import {ManageOrganizationsService} from 'src/app/services/manage-organizations.service';

import {AuthService} from '../../services/auth.service';
import {NgForm} from '@angular/forms';
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
  organizations = Array<Organization>();
  selectedOrganization: any;
  errorMessage = '';
  //TODO: if dead code, remove
  // orgEdit;

  dataSource: MatTableDataSource<Organization>;
  displayedColumns: string[] = ['1', 'Company_name', 'Activated_On', 'Status', 'Address', '2'];
  filterTerm: string;
  selected: string;

  constructor(
    private organizationsService: ManageOrganizationsService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.selectedOrganization = {org_id: -1, org_name: '', status: ''};
    this.dataSource = new MatTableDataSource<Organization>();
    this.filterTerm = '';
    this.selected = 'All';
  }

  dataSource: MatTableDataSource<Organization>;
  displayedColumns: string[] = ['Company_name', 'Activated_On', 'Status', 'Address', '2'];
  filterTerm: string;
  selected = 'All';

  //@ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  // @ts-ignore
  @ViewChild('updateOrgDialog') updateOrgDialog: TemplateRef<any>;
  // @ts-ignore
  @ViewChild('createOrgDialog') createOrgDialog: TemplateRef<any>;

  // @ts-ignore
  @Input() isActive: string;
  activeStates = [{status: 'active'}, {status: 'disabled'}];

  ngOnInit(): void {
    this.getAllOrganizations();
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

  openUpdateOrgDialog(organization: any): void {
    this.selectedOrganization = organization;
    this.isActive = organization.status ? 'active' : 'disabled';
    //TODO: if dead code, remove
    // const dialogRef = this.dialog.open(this.updateOrgDialog);
  }

  openCreateDialog(): void {
    this.dialog.open(this.createOrgDialog);
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
