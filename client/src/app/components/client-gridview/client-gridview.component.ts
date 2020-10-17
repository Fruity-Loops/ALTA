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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private manageMembersService: ManageMembersService,
    private changeDetectorRefs: ChangeDetectorRef) {
    this.users = new Array<User>();

    // Assign the data to the data source for the table to render
    this.manageMembersService.getAllClients()
      .subscribe((user) => {
        const users = JSON.parse(user);
        this.updateClients(users);
      });
  }

  ngOnInit(): void {

  }

  applyFilter(event: Event): void {

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateClients(clients): void {
      this.users = new Array<User>();
      clients.forEach(element => {
        this.users.push(element);
      });
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.changeDetectorRefs.detectChanges();
  }

}
