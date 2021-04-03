import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ManageOrganizationsService} from 'src/app/services/organizations/manage-organizations.service';
import {AuthService} from 'src/app/services/authentication/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {TableManagementComponent} from 'src/app/components/TableManagement.component';
import {MatSort} from '@angular/material/sort';
import {FormBuilder} from '@angular/forms';
import {Organization} from 'src/app/models/organization';
import {MatDialog} from '@angular/material/dialog';
import {ManageOrganizationsLangFactory, ManageOrganizationTableHeaders} from './manage-organizations.language';
import {Language} from '../../../services/Language';

@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.scss'],
})
export class ManageOrganizationsComponent extends TableManagementComponent implements OnInit {
  orgData: any;
  organizations = [];
  selectedOrganization: Organization;
  errorMessage = '';
  // orgEdit;
  dataSource: MatTableDataSource<Organization>;
  displayedColumns: string[] = ['Company_name', 'Activated_On', 'Status', 'Address', '2'];
  filterTerm: string;
  selected = 'All';

  title: string;
  searchPlaceholder: string;
  tableHeaders: ManageOrganizationTableHeaders;
  addButton: string;

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
    public dialog: MatDialog,
    protected fb: FormBuilder
  ) {
    super(fb);
    this.selectedOrganization = {org_id: -1, org_name: '', status: '', address: ''};
    this.errorMessage = '';
    this.activeStates = [{status: 'active'}, {status: 'disabled'}];
    this.dataSource = new MatTableDataSource();
    this.filterTerm = '';

    const lang = new ManageOrganizationsLangFactory(Language.ENGLISH);
    [this.title, this.searchPlaceholder, this.tableHeaders, this.addButton] = [lang.lang.title, lang.lang.searchPlaceholder,
      lang.lang.tableHeaders, lang.lang.addButton];
  }

  ngOnInit(): void {
    this.setParams();
    this.getPagedOrgs();
  }

  setParams(): void {
    this.params = this.params.append('page', String(this.pageIndex))
    .append('page_size', String(this.pageSize));
  }

  getPagedOrgs(): void {
    this.organizationsService.getPagedOrganizations(this.params).subscribe(
      (data) => {
        this.errorMessage = '';
        this.orgData = data;
        this.organizations = data.results;
        this.updatePaginator();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  updatePaginator(): void {
    this.length = this.orgData.count;
    if (this.pageIndex > 0){
      this.pageIndex = this.pageIndex - 1;
    }
    this.errorMessage = '';
    this.organizations = this.orgData.results;
    // @ts-ignore
    this.dataSource = new MatTableDataSource(this.organizations);
  }


  updatePage(): void {
    this.organizationsService.getPagedOrganizations(this.params).subscribe(
      (data) => {
        this.orgData = data;
        this.updatePaginator();
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  getSearchForm(): any {
    return {
      search: [''],
    };
  }

  preventPropagation(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  openUpdateOrgDialog(organization: Organization): void {
    this.selectedOrganization = organization;
    this.isActive = organization.status ? 'active' : 'disabled';
  }

  isGlobal(address: string): string {
    const bracketCount = address.split('[').length - 1;
    if (bracketCount > 3) {
      return 'GLOBAL';
    } else {
      // Remove open and close bracket and apostrophe from the address string.
      return address.replace(/\[|\]|\'/g, '');
    }
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
