import { Component, OnInit, TemplateRef } from '@angular/core';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { ManageAuditsService } from 'src/app/services/manage-audits.service';
import { User } from 'src/app/models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-assign-stock-keepers',
  templateUrl: './assign-stock-keepers.component.html',
  styleUrls: ['./assign-stock-keepers.component.scss']
})
export class AssignStockKeepersComponent implements OnInit {
  skToAssign = [];
  busySKs: Array<any>;
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['Check_Boxes', 'First_Name', 'Last_Name', 'Availability'];
  locationsAndUsers: Array<any>;
  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';

  // Http URL params
  params = new HttpParams();

  constructor(private manageMembersService: ManageMembersService,
              private dialog: MatDialog,
              private addAssignedSK: ManageAuditsService,
              private router: Router)
  { }

  ngOnInit(): void {
    this.locationsAndUsers = new Array<any>();
    this.skToAssign = [];
    this.busySKs = new Array<any>();

    this.params = this.params.append('organization', String(localStorage.getItem('organization_id')));
    this.params = this.params.append('status', 'Active');

    this.addAssignedSK.getBusySKs(this.params)
      .subscribe((response) => {
        this.busySKs = response.map(obj => obj.assigned_sk).flat();

        this.manageMembersService.getAllClients()
          .subscribe((user) => {
            this.populateTable(user);
        });
    });
  }

  populateTable(clients): void {
    /* TODO: look into performance impact of:
    * 1. sending all an organization's users with a realistic amount of users
    * 2. how slow this can be to compute on the front-end
    */

    clients.forEach(element => {
      if (element.role === 'SK') {
        const isBusy = this.busySKs.find(user => user === element.id);
        if (isBusy === undefined) {
          element.availability = 'Available';
        } else {
          element.availability = 'Busy';
        }

        const obj = this.locationsAndUsers.find(item => item.location === element.location);
        if (obj === undefined) {
            this.locationsAndUsers.push(
            {
              location: element.location,
              users: new Array<User>(element)
            });
        }
        else {
          obj.users.push(element);
        }
      }
    });

    this.dataSource = new MatTableDataSource();
    this.locationsAndUsers.forEach(item => {
      item.users.forEach(user => {
        this.dataSource.data.push(user);
      });
    });
  }

  // If a stock-keeper checkbox is selected then add the id to the list
  onChange(value: any): void {
    if (this.skToAssign.includes(value)) {
      this.skToAssign.splice(
        this.skToAssign.indexOf(value),
        1
      );
    } else {
      this.skToAssign.push(value);
    }
  }

  submitAssignedSKs(): void {
    let bodyAssignedSK: any;
    bodyAssignedSK = {
      assigned_sk: this.skToAssign,
    };
    this.addAssignedSK.assignSK(bodyAssignedSK, Number(localStorage.getItem('audit_id'))).subscribe(
      (data) => {
        this.skToAssign = [];
        setTimeout(() => {
          // Redirect user to component dashboard
          this.router.navigate(['designate-sk']);
        }, 1000); // Waiting 1 second before redirecting the user
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  openDialogWithRef(ref: TemplateRef<any>): void {
    this.dialog.open(ref);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
