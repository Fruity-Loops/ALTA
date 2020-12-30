import { Component, OnInit } from '@angular/core';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { User } from 'src/app/models/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-assign-stock-keepers',
  templateUrl: './assign-stock-keepers.component.html',
  styleUrls: ['./assign-stock-keepers.component.scss']
})
export class AssignStockKeepersComponent implements OnInit {

  users: Array<User>;
  dataSource: MatTableDataSource<User>
  displayedColumns: string[] = ['Check_Boxes', 'First_Name', 'Last_Name'];
  roles = [
    { name: 'System Admin', abbrev: 'SA'},
    { name: 'Inventory Manager', abbrev: 'IM' },
    { name: 'Stock Keeper', abbrev: 'SK' },
  ];
  panelOpenState: boolean = false;
  allExpandState = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private manageMembersService: ManageMembersService, private dialog: MatDialog)
  { }

  openDialogWithRef(ref: TemplateRef<any>) {
    this.dialog.open(ref);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  ngOnInit(): void {
    this.users = new Array<User>();
    this.manageMembersService.getAllClients()
    .subscribe((user) => {
      const users = user;
      this.populateTable(users);
    });
  }

  populateTable(clients): void {
    clients.forEach(element => {
      const obj = this.roles.find(o => o.abbrev === element.role);
      if (element.role === 'SK')
        this.users.push(element);
    });
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
  }


}
