import {Component, HostListener, OnInit, TemplateRef} from '@angular/core';
import {ManageMembersService} from 'src/app/services/users/manage-members.service';
import {AuditLocalStorage, ManageAuditsService} from 'src/app/services/audits/manage-audits.service';
import {User} from 'src/app/models/user.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {AuthService, UserLocalStorage} from '../../services/authentication/auth.service';

@Component({
  selector: 'app-assign-stock-keepers',
  templateUrl: './assign-stock-keepers.component.html',
  styleUrls: ['./assign-stock-keepers.component.scss']
})
export class AssignStockKeepersComponent implements OnInit {
  skToAssign: Array<any>;
  busySKs: Array<any>;
  itemLocations: Array<any>;
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['Check_Boxes', 'First_Name', 'Last_Name', 'Availability'];
  locationsAndUsers: Array<any>;
  auditID: number;

  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';

  params = new HttpParams();

  constructor(
    private manageMembersService: ManageMembersService,
    private dialog: MatDialog,
    private manageAuditsService: ManageAuditsService,
    private authService: AuthService,
    private router: Router
  ) {

    this.dataSource = new MatTableDataSource<User>();
    this.locationsAndUsers = new Array<any>();
    this.skToAssign = [];
    this.itemLocations = [];
    this.busySKs = new Array<any>();
    this.auditID = Number(this.manageAuditsService.getLocalStorage(AuditLocalStorage.AuditId));
  }

  ngOnInit(): void {

    this.params = this.params.append('organization', String(this.authService.getLocalStorage(UserLocalStorage.OrgId)));
    this.params = this.params.append('status', 'Active');

    this.manageAuditsService.getBusySKs(this.params)
      .subscribe((response) => {
        this.busySKs = response.map((obj: any) => obj.assigned_sk).flat();

        this.manageMembersService.getAllClients()
          .subscribe((user) => {
            this.populateTable(user);
          });
      });
  }

  populateTable(clients: any): void {
    /* TODO: look into performance impact of:
    * 1. sending all an organization's users with a realistic amount of users
    * 2. how slow this can be to compute on the front-end
    */

    this.manageAuditsService.getAuditData(this.auditID).subscribe((selectedItems) => {
       const itemsLocation = selectedItems.inventory_items.map((obj: any) => obj.Location);
       itemsLocation.forEach((selectedItem: any) => {
        const obj = this.locationsAndUsers.find((item: any) => item.location === selectedItem);
          if (obj === undefined) {
            const getSKForLoc = clients.filter((user: any) => user.location === selectedItem && user.role === "SK");
            if(getSKForLoc.length !== 0) {
              this.locationsAndUsers.push(
              {
                location: selectedItem,
                users: getSKForLoc
              });
            } else {
              this.locationsAndUsers.push(
              {
                location: selectedItem,
                users: []
              });
            }
          }
       });

      this.locationsAndUsers.forEach((location: any) => {
        location.users.forEach((user: any) => {
          const isBusy = this.busySKs.find(busyUser => busyUser === user.id);
       	  if (isBusy === undefined) {
       	    user.availability = 'Available';
          } else {
            user.availability = 'Busy';
          }
        });
      });

      this.dataSource = new MatTableDataSource();
      this.locationsAndUsers.forEach(item => {
        item.users.forEach((user: User) => {
          this.dataSource.data.push(user);
        });
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
    this.manageAuditsService.assignSK(bodyAssignedSK, this.auditID).subscribe(
      (data) => {
        this.skToAssign = [];
        setTimeout(() => {
          this.router.navigate(['audits/assign-sk/designate-sk']);
        }, 1000);
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  deleteAudit(): void {
    this.manageAuditsService.deleteAudit(this.auditID).subscribe((
      (err) => {
        this.errorMessage = err;
      }));
    this.manageAuditsService.removeFromLocalStorage(AuditLocalStorage.AuditId);
  }

  @HostListener('window:popstate', ['$event'])
  onBrowserBack(event: Event): void {
    // Overrides browser back button
    event.preventDefault();
    this.goBackIventory();
  }

  goBackIventory(): void {
    // TODO: Show previously selected info is kept data so when user goes back to previous page
    setTimeout(() => {
      this.router.navigate(['manage-items'], { replaceUrl: true });
    }, 1000);
  }

  openDialogWithRef(ref: TemplateRef<any>): void {
    this.dialog.open(ref);
  }

  cancelDialog(): void {
    this.dialog.closeAll();
  }

  discardAudit(): void {
    this.deleteAudit();
    this.dialog.closeAll();
  }
}
