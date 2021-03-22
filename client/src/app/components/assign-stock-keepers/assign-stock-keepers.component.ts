import { Component, OnInit, TemplateRef } from '@angular/core';
import { ManageMembersService } from 'src/app/services/users/manage-members.service';
import { AuditLocalStorage, ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { User } from 'src/app/models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { AuthService, UserLocalStorage } from '../../services/authentication/auth.service';
import { IDeactivateComponent } from '../../guards/can-deactivate.guard';

@Component({
  selector: 'app-assign-stock-keepers',
  templateUrl: './assign-stock-keepers.component.html',
  styleUrls: ['./assign-stock-keepers.component.scss']
})

export class AssignStockKeepersComponent implements OnInit, IDeactivateComponent {
  skToAssign: Array<any>;
  assignments: Array<any>;
  busySKs: Array<any>;
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['Check_Boxes', 'First_Name', 'Last_Name', 'Availability'];
  locationsAndUsers: Array<any>;
  holdItemsLocation: Array<any>;
  maxAssignPerLocation: Array<any>;
  auditID: number;

  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';
  missingAssignedLocations = true;
  isDirty = true;
  browserRefresh = false;

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
    this.assignments = [];
    this.holdItemsLocation = [];
    this.maxAssignPerLocation = new Array<any>();
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

      this.holdItemsLocation = selectedItems.inventory_items.map((obj: any) => obj.Location);
      this.holdItemsLocation.forEach((location: any) => {

        this.setMaxAssignPerLocation(location, selectedItems);

        this.addLocationWithSKs(location, clients);
      });


      if (selectedItems.assigned_sk !== []) {
        this.skToAssign = selectedItems.assigned_sk.map((obj: any) => obj.id);
      }

      this.setCheckboxDisableStatus();

      this.dataSource = new MatTableDataSource();
      this.locationsAndUsers.forEach(item => {
        item.users.forEach((user: User) => {
          this.dataSource.data.push(user);
        });
      });
    });
  }

  setMaxAssignPerLocation(location: any, correspondingObj: any): void {
    if (!this.maxAssignPerLocation.some((item: any) => item.location === location)) {
      const locTotalBins = new Set(correspondingObj.inventory_items.filter((item: any) =>
        item.Location === location).map((ob: any) => ob.Bin)).size;

        this.maxAssignPerLocation.push({
          location: location,
          totalBins: locTotalBins
        });
    }
  }

  addLocationWithSKs(location: any, clients: any): void {
    if (this.locationsAndUsers.find((item: any) => item.location === location) === undefined) {
      const getSKForLoc = clients.filter((user: any) =>
        user.location === location && user.role === 'SK');
        if (getSKForLoc.length !== 0) {
          this.locationsAndUsers.push(
            {
              location: location,
              users: getSKForLoc
            });
        } else {
          this.locationsAndUsers.push(
            {
              location: location,
              users: []
            });
        }
    }
  }

  setCheckboxDisableStatus(): void {
    this.locationsAndUsers.forEach((location: any) => {

      const maxPerLocation = this.maxAssignPerLocation.find(obj => obj.location === location.location).totalBins;
      let counter = 0;

      location.users.forEach((user: any) => {
        this.setBusyStatus(user);

        // enable the checkbox for previously selected SKs
        if (this.skToAssign.includes(user.id)) {
          user.disabled = false;
          counter++;
        }
      });

      // disable other SKs if assign limit is reached for location
      if (counter >= maxPerLocation) {
        location.users.forEach((user: any) => {
          if (!this.skToAssign.includes(user.id)) {
            user.disabled = true;
          }
        });
      }
    });
  }

  setBusyStatus(user: any): void {
    const isBusy = this.busySKs.find(busyUser => busyUser.id === user.id);
    if (isBusy === undefined) {
      user.availability = 'Available';
    } else {
      user.availability = 'Busy';
    }
  }

  isChecked(userId: any): boolean {
    return this.skToAssign.indexOf(userId) !== -1;
  }

  onChange(userId: any, loc: any): void {

    const getLimitOfAssignees = this.maxAssignPerLocation.find(total => total.location === loc).totalBins;
    const holdUsersForThisLocation = this.locationsAndUsers.filter(user => user.location === loc).
      map((obj: any) => obj.users).flat(1);

    // get all the user id's for this location
    const sksFromLocation = holdUsersForThisLocation.map((user: any) => user.id);

    if (this.skToAssign.includes(userId)) {
      this.skToAssign.splice(
        this.skToAssign.indexOf(userId),
        1
      );
      this.assignments = this.assignments.filter(obj => obj.assigned_sk !== userId);

      // get the updated intersection of selected SKs for this location
      const intersection = this.skToAssign.filter(x => sksFromLocation.includes(x));

      // if there are still SKs to assign after unselecting a user
      if (intersection.length < getLimitOfAssignees) {
        sksFromLocation.forEach((sk: any) => {
          // enable the selection of other SKs of this location
          if (!intersection.some((id: any) => id === sk)) {
            holdUsersForThisLocation.find((user: any) => user.id === sk).disabled = false;
          }
        });
      }
    } else {
      this.skToAssign.push(userId);
      this.assignments.push({
        audit: this.auditID,
        assigned_sk: userId,
        seen: false
      });

      // get the updated intersection of selected SKs for this location
      const intersection = this.skToAssign.filter(x => sksFromLocation.includes(x));

      if (intersection.length >= getLimitOfAssignees) {
        sksFromLocation.forEach((sk: any) => {
          // disable the selection of other SKs of this location
          if (!intersection.some((id: any) => id === sk)) {
            holdUsersForThisLocation.find((user: any) => user.id === sk).disabled = true;
          }
        });
      }
    }
    this.isDirty = this.skToAssign?.length > 0 ? true : false;
  }

  submitAssignedSKs(): void {
    let bodyAssignedSK: any;
    bodyAssignedSK = {
      assigned_sk: this.skToAssign,
    };
    this.manageAuditsService.assignSK(bodyAssignedSK, this.auditID).subscribe(
      (data) => {
        this.skToAssign = [];
        this.manageAuditsService.createAuditAssignments(this.assignments).subscribe(
          _ => {
            this.assignments = [];
          },
          (err) => {
            this.errorMessage = err;
          }
        );
        this.isDirty = false;
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
    this.isDirty = false;
    this.deleteAudit();
    this.dialog.closeAll();
  }

  disableAssign(): boolean {
    if (this.skToAssign.length === 0) {
      return true;
    }

    let counter = 0;
    this.locationsAndUsers.forEach((loc: any) => {
      const intersection = new Set(loc.users.flat().map((obj: any) => obj.id).filter((x: any) => this.skToAssign.includes(x)));
      if (intersection.size !== 0) {
        counter++;
      }
    });

    return counter < this.locationsAndUsers.length;
  }
}
