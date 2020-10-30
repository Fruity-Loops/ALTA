import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ManageMembersService } from 'src/app/services/manage-members.service';

@Component({
  selector: 'app-client-gridview',
  templateUrl: './client-gridview.component.html',
  styleUrls: ['./client-gridview.component.css']
})

export class ClientGridviewComponent implements OnInit {
  view = 'Client Gridview';
  users: Array<User>;

  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['First Name', 'Is Active', 'Last Name', 'Role'];
  filterTerm: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private manageMembersService: ManageMembersService,
    private changeDetectorRefs: ChangeDetectorRef) {
    this.users = new Array<User>();
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    // Assign the data to the data source for the table to render
    this.manageMembersService.getAllClients()
      .subscribe((user) => {
        const users = user;
        this.populateTable(users);
      });
  }

  applyFilter(filterTerm: string):void {
    this.dataSource.filter = filterTerm;
  }

  populateTable(clients): void {
    this.users = new Array<User>();
    clients.forEach(element => {
      this.users.push(element);
    });
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.changeDetectorRefs.detectChanges();
  }

}
