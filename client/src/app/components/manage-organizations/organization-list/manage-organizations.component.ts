import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ManageOrganizationsService} from 'src/app/services/organizations/manage-organizations.service';

import {AuthService} from '../../../services/authentication/auth.service';
import {ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Organization} from '../../../models/organization';
import {MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.scss'],
})
export class ManageOrganizationsComponent implements OnInit {
  organizations = [];
  selectedOrganization: Organization;
  errorMessage = '';
  // orgEdit;
  dataSource: MatTableDataSource<Organization>;
  displayedColumns: string[] = ['Company_name', 'Activated_On', 'Status', 'Address', '2'];
  filterTerm: string;
  selected = 'All';

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  // @ts-ignore
  @ViewChild('updateOrgDialog') updateOrgDialog: TemplateRef<any>;
  // @ts-ignore
  @ViewChild('createOrgDialog') createOrgDialog: TemplateRef<any>;

  // @ts-ignore
  @Input() isActive: string;

  activeStates = Array<any>();

  constructor(
    private organizationsService: ManageOrganizationsService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.selectedOrganization = {org_id: -1, org_name: '', status: '', address: ''};
    this.errorMessage = '';
    this.activeStates = [{status: 'active'}, {status: 'disabled'}];
    this.dataSource = new MatTableDataSource();
    this.filterTerm = '';
  }

  ngOnInit(): void {
    this.getAllOrganizations();
  }

  getAllOrganizations(): void {
    this.organizationsService.getAllOrganizations().subscribe(
      (data) => {
        this.organizations = data;
        this.errorMessage = '';
        // @ts-ignore
        this.dataSource = new MatTableDataSource(this.organizations);
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  updateOrganization(organization: Organization): void {
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

  openUpdateOrgDialog(organization: Organization): void {
    this.selectedOrganization = organization;
    this.isActive = organization.status ? 'active' : 'disabled';
  }

  openCreateDialog(): void {
    this.dialog.open(this.createOrgDialog);
  }

  turnOnOrgMode(organization: Organization): void {
    this.authService.turnOnOrgMode({organization: organization.org_id, organization_name: organization.org_name}, true);
  }


  applyFilter(filterTerm: string): void {
    this.dataSource.filter = filterTerm;
  }
}
