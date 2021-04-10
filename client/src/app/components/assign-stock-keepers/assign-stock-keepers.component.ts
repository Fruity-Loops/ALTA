import {Component, HostListener, OnInit, TemplateRef} from '@angular/core';
import {ManageMembersService} from 'src/app/services/users/manage-members.service';
import {AuditLocalStorage, ManageAuditsService} from 'src/app/services/audits/manage-audits.service';
import {User} from 'src/app/models/user.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {AuthService, UserLocalStorage} from '../../services/authentication/auth.service';
import {ActionButtons, AssignStockKeepersLangFactory, SKTable} from './assign-stock-keepers.language';
import { IDeactivateComponent } from '../../guards/can-deactivate.guard';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-assign-stock-keepers',
  templateUrl: './assign-stock-keepers.component.html',
  styleUrls: ['./assign-stock-keepers.component.scss']
})

export class AssignStockKeepersComponent implements OnInit, IDeactivateComponent {
  @ViewChild('discardDialog', { static: true }) template: TemplateRef<any>;
  skToAssign: Array<any>;
  assignments: Array<any>;
  busySKs: Array<any>;
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['Check_Boxes', 'First_Name', 'Last_Name', 'Availability'];
  locationsAndUsers: Array<any>;
  maxAssignPerLocation: Array<any>;
  auditID: number;

  title: string;
  skTable: SKTable;
  actionButtons: ActionButtons;

  panelOpenState = false;
  allExpandState = false;
  errorMessage = '';
  missingAssignedLocations = true;
  requestConfirmation = true;

  params = new HttpParams();

  constructor(
    private manageMembersService: ManageMembersService,
    public dialog: MatDialog,
    private manageAuditsService: ManageAuditsService,
    private authService: AuthService,
    public router: Router
  ) {
    const lang = new AssignStockKeepersLangFactory();
    [this.title, this.skTable, this.actionButtons] = [lang.lang.title, lang.lang.skTable, lang.lang.actionButtons];

    this.dataSource = new MatTableDataSource<User>();
    this.locationsAndUsers = new Array<any>();
    this.skToAssign = [];
    this.assignments = [];
    this.maxAssignPerLocation = new Array<any>();
    this.busySKs = new Array<any>();
    this.auditID = Number(this.manageAuditsService.getLocalStorage(AuditLocalStorage.AuditId));
  }

  ngOnInit(): void {
    this.params = this.params.
                    append('organization', String(this.authService.getLocalStorage(UserLocalStorage.OrgId))).
                    append('status', 'Active').
                    append('no_pagination', 'True');

    this.manageAuditsService.getBusySKs(this.params)
      .subscribe((response) => {
        this.busySKs = response.map((obj: any) => obj.assigned_sk).flat();

        this.manageMembersService.getAllClients()
          .subscribe((data) => {
            this.populateTable(data);
          });
      });
  }

  populateTable(clients: any): void {
    this.manageAuditsService.getAuditData(this.auditID).subscribe((selectedItems) => {

      if (selectedItems.assigned_sk !== [])
          this.skToAssign = selectedItems.assigned_sk.map((obj: any) => obj.id);

      selectedItems.inventory_items.map((obj: any) => obj.Location).forEach((location: any) => {

        this.maxAssignPerLocation = this.maxAssignPerLocation.
                                    concat(this.getMaxAssignPerLocation(location, selectedItems));

        this.locationsAndUsers = this.locationsAndUsers.concat(this.addLocationWithSKs(location, clients));
      });

      this.setCheckboxDisableStatus();

      this.dataSource = new MatTableDataSource();
      this.locationsAndUsers.forEach(item => {
        item.users.forEach((user: User) => {
          this.dataSource.data.push(user);
        });
      });
    });
  }

  getMaxAssignPerLocation(location: any, correspondingObj: any): any {
    if (!this.maxAssignPerLocation.some((item: any) => item.location === location)) {
      return [{
        location,
        totalBins: new Set(correspondingObj.inventory_items.filter((item: any) =>
                   item.Location === location).map((ob: any) => ob.Bin)).size
      }];
    }
    return [];
  }

  addLocationWithSKs(location: any, clients: any): any {
    if (!this.locationsAndUsers.find((item: any) => item.location === location)) {
      const getSKForLoc = clients.filter((user: any) =>
        user.location === location && user.role === 'SK');
      if (getSKForLoc.length) {
        return [{location, users: getSKForLoc}];
      } else {
        return [{location, users: []}];
      }
    }
    return [];
  }

  setCheckboxDisableStatus(): void {
    this.locationsAndUsers.forEach((location: any) => {
      let counter = 0;

      location.users.forEach((user: any) => {
        this.setBusyStatus(user, this.busySKs.find(busyUser => busyUser.id === user.id));

        // enable the checkbox for previously selected SKs
        if (this.skToAssign.includes(user.id)) {
          user.disabled = false;
          counter++;
        }
      });

      // disable other SKs if assign limit is reached for location
      if (counter >= this.maxAssignPerLocation.find(obj => obj.location === location.location).totalBins) {
        location.users.forEach((user: any) => {
          if (!this.skToAssign.includes(user.id)) {
            user.disabled = true;
          }
        });
      }
    });
  }

  setBusyStatus(user: any, isBusy: any): void {
    if (!isBusy) {
      user.availability = 'Available';
    } else {
      user.availability = 'Busy';
    }
  }

  isChecked(userId: any): boolean {
    return this.skToAssign.indexOf(userId) !== -1;
  }

  onChange(userId: any, loc: any): void {
    const holdUsersForThisLocation = this.locationsAndUsers.filter(user => user.location === loc).
      // @ts-ignore
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
      if (intersection.length < this.maxAssignPerLocation.find(total => total.location === loc).totalBins) {
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

      if (intersection.length >= this.maxAssignPerLocation.find(total => total.location === loc).totalBins) {
        sksFromLocation.forEach((sk: any) => {
          // disable the selection of other SKs of this location
          if (!intersection.some((id: any) => id === sk)) {
            holdUsersForThisLocation.find((user: any) => user.id === sk).disabled = true;
          }
        });
      }
    }
    this.requestConfirmation = this.skToAssign?.length > 0 ? true : false;
  }

  submitAssignedSKs(): void {
    this.manageAuditsService.assignSK({assigned_sk: this.skToAssign,}, this.auditID).subscribe(
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
        this.requestConfirmation = false;
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

  goBackInventory(): void {
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
    this.requestConfirmation = false;
    this.deleteAudit();
    this.dialog.closeAll();
  }

  disableAssign(): boolean {
    if (!this.skToAssign.length) {
      return true;
    }

    let counter = 0;
    this.locationsAndUsers.forEach((loc: any) => {
      if (new Set(loc.users.flat().map((obj: any) => obj.id).
            filter((x: any) => this.skToAssign.includes(x))).size !== 0) {
        counter++;
      }
    });

    return counter < this.locationsAndUsers.length;
  }

  // handles page refresh and out-of-app navigation
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any): boolean {
    return confirm('');
  }
}
