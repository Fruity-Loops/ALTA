import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import roles from 'src/app/fixtures/roles.json';

@Component({
  selector: 'app-client-gridview',
  templateUrl: './client-gridview.component.html',
  styleUrls: ['./client-gridview.component.scss'],
})
export class ClientGridviewComponent implements OnInit {
  view = 'Client Gridview';
  users: Array<User>;

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
    private changeDetectorRefs: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<User>();
    this.users = new Array<User>();
    this.manageMembersService.getAllClients().subscribe((user) => {
      this.populateTable(user);
    });
    this.filterTerm = '';
    this.selected = 'All';
  }

  ngOnInit(): void {}

  applyFilter(filterTerm: string): void {
    this.dataSource.filter = filterTerm;
  }

  populateTable(clients: Array<User>): void {
    if (clients[0].role !== 'SA') {
      // TODO: inconsistent with declaration/initialization
      this.displayedColumns = [
        'First_Name',
        'Last_Name',
        'Role',
        'Location',
        'Status',
        'Settings',
      ];
    }
    clients.forEach((element) => {
      const obj = this.roles.find((o) => o.abbrev === element.role);
      if (obj) {
        element.role = obj.name;
      } else {
        element.role = '';
      }
      this.users.push(element);
    });
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Rows per page:';
    this.dataSource.sort = this.sort;
    this.changeDetectorRefs.detectChanges();
  }
}
