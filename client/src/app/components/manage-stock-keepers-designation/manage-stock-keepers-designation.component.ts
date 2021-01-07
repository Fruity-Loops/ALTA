import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { ManageAuditsService } from 'src/app/services/manage-audits.service';
import { User } from 'src/app/models/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-manage-stock-keepers-designation',
  templateUrl: './manage-stock-keepers-designation.component.html',
  styleUrls: ['./manage-stock-keepers-designation.component.scss']
})
export class ManageStockKeepersDesignationComponent implements OnInit {

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  skToAssign = [];
  locationsAndUsers: Array<any>;
  panelOpenState: boolean = false;
  allExpandState = false;
  errorMessage = '';
  designationDrag = [];
  skDrop = [];

  constructor(private manageMembersService: ManageMembersService,
              private dialog: MatDialog,
              private addAssignedSK: ManageAuditsService,
              private router: Router)
  { }

  ngOnInit(): void {
    this.locationsAndUsers = new Array<any>();
    this.skToAssign = [];
    this.manageMembersService.getAllClients()
    .subscribe((user) => {
      const users = user;
      this.populateTable(users);
    });

    this.designationDrag = [
      'Bin A'
    ];
  }

  populateTable(clients): void {
    clients.forEach(element => {
      if (element.role === 'SK') {
        const obj = this.locationsAndUsers.find(item => item.location === element.location);
        if(obj === undefined) {
          this.locationsAndUsers.push(
          {
            location: element.location,
            users: new Array<User>(element),
          });
        }
        else {
          const index = this.locationsAndUsers.findIndex(item => item.location === element.location);
          this.locationsAndUsers[index].users.push(element);
        }
      }
    });

  }

  //If a stock-keeper checkbox is selected then add the id to the list
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
      audit_id: Number(localStorage.getItem('audit_id')),
      assigned_sk: this.skToAssign,
    };
    this.addAssignedSK.assignSK(bodyAssignedSK).subscribe(
      (data) => {
        this.skToAssign = [];
        setTimeout(() => {
          // Redirect user to component dashboard
          this.router.navigate(['dashboard']);
        }, 1000); // Waiting 1 second before redirecting the user
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  openDialogWithRef(ref: TemplateRef<any>) {
    this.dialog.open(ref);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
