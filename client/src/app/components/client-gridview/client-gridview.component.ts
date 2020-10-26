import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/models/user.model';
import {AfterViewInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManageMembersService } from 'src/app/services/manage-members.service';

@Component({
  selector: 'app-client-gridview',
  templateUrl: './client-gridview.component.html',
  styleUrls: ['./client-gridview.component.css']
})

export class ClientGridviewComponent implements OnInit {
  displayedColumns: string[] = ['First Name', 'Is Active', 'Last Name', 'Role'];
  dataSource: MatTableDataSource<User>;
  users: Array<User>;
  view = 'Client Gridview';
  editField: string;
  errorMessage: string;
  body: any;
  roles = [
    { name: 'System Admin', abbrev: 'SA' },
    { name: 'Inventory Manager', abbrev: 'IM' },
    { name: 'Stock Keeper', abbrev: 'SK' },
  ];
  isActive = [
    {value: true},
    {value: false}];
    selectedItem: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private manageMembersService: ManageMembersService,
    private changeDetectorRefs: ChangeDetectorRef) {
    this.users = new Array<User>();
  }

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients(): void {
    // Assign the data to the data source for the table to render
    this.manageMembersService.getAllClients()
      .subscribe((user) => {
        const users = user;
        this.populateTable(users);
      });
  }

  applyFilter(event: Event): void {

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  populateTable(clients): void {
      this.users = new Array<User>();
      clients.forEach(element => {
        this.users.push(element);
      });
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.changeDetectorRefs.detectChanges();
  }

  // Modifies the user by calling the API and then refreshes the table
  updateUser(id: number, property: string, event: any): void {
    let editField;
    // Dropdown values are sent as events, editable text such as the names are sent via string
    if (typeof event === 'string' || typeof event === 'boolean')
    {
      editField = event;
    }
    else
    {
      editField = event.target.textContent;
    }
    this.manageMembersService.modifyClientInfo(property, editField, id).subscribe(
    (response) => {
      this.users[id-1][property] = response[property];
    },
    (err) => {
      // If name contains illegal characters
      if (err.error.last_name) {
        this.errorMessage = err.error.last_name[0];
      }

      // If name contains illegal characters
      if (err.error.first_name) {
        this.errorMessage = err.error.first_name[0];
      }
    });
  }

  changeValue(id: number, property: string, event: any): void {
    this.editField = event.target.textContent;
  }
}
