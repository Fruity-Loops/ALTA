import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from 'src/app/models/user.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ManageMembersService} from 'src/app/services/users/manage-members.service';
import roles from 'src/app/fixtures/roles.json';
import {EmployeeListLangFactory, EmployeeListTable} from './employee-list.language';
import { FormBuilder } from '@angular/forms';
import { TableManagementComponent } from 'src/app/components/TableManagement.component';

@Component({
  selector: 'app-client-gridview',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent extends TableManagementComponent implements OnInit {
  view = 'Client Gridview';
  userData: any;
  users: Array<User>;

  title: string;
  searchPlaceholder: string;
  table: EmployeeListTable;

  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = [
    'First_Name',
    'Last_Name',
    'Status',
    'Settings',
  ];
  roles = roles;
  filterTerm: string;
  selected: string;

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private manageMembersService: ManageMembersService,
    protected fb: FormBuilder
  ) {
    super(fb);
    this.dataSource = new MatTableDataSource<User>();
    this.users = new Array<User>();
    this.filterTerm = '';
    this.selected = 'All';
    const lang = new EmployeeListLangFactory();
    [this.title, this.searchPlaceholder, this.table] = [lang.lang.title, lang.lang.searchPlaceholder, lang.lang.table];
  }

  ngOnInit(): void {
    this.setParams();
    this.getPagedUsers();
  }

  setParams(): void {
    this.params = this.params.append('page', String(this.pageIndex))
      .append('page_size', String(this.pageSize));
  }

  getPagedUsers(): void {
    this.manageMembersService.getPaginatedClients(this.params).subscribe(
      (data) => {
        this.userData = data;
        this.updatePaginator();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(filterTerm: string): void {
    this.dataSource.filter = filterTerm;
  }

  getSearchForm(): any {
    return {
      search: [''],
    };
  }

  updatePage(): void {
    this.manageMembersService.getPaginatedClients(this.params).subscribe(
      (data) => {
        this.userData = data;
        this.updatePaginator();
      }
    );
  }

  updatePaginator(): void {
    this.length = this.userData.count;
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
    }
    this.users = this.userData.results;
    // @ts-ignore
    this.dataSource = new MatTableDataSource(this.users);
  }
}
