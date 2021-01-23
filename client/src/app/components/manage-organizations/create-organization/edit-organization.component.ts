import {Component, Inject, OnInit, Optional} from '@angular/core';
import {ManageOrganizationsService} from '../../../services/manage-organizations.service';
import {ActivatedRoute} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DeleteTemplateDialogComponent} from '../../audit-template/audit-template-list/audit-template.component';
import {OrganizationViewComponent} from './organization-view.component';


@Component({
  selector: 'app-edit-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class EditOrganizationComponent extends OrganizationViewComponent {

  isActive = 'Active';
  activeStates = ['Active', 'Disabled'];

  orgID: string;

  dialogRef: any;
  originalStatus: boolean;

  constructor(
    private organizationService: ManageOrganizationsService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    super();

    // Called after the super to avoid calling this before setting the organization detail defaults
    this.activatedRoute.params.subscribe(routeParams => {
      this.orgID = routeParams.ID;
      this.organizationService.getOneOrganization(this.orgID).subscribe(organization => {
        this.isActive = organization.status ? this.activeStates[0] : this.activeStates[1];
        this.originalStatus = organization.status;
        this.orgName = organization.org_name;
        this.location = organization.address;
      });
    });
  }

  getEditInfo(): [boolean, boolean] {
    return [false, true];
  }

  getComponentTitle(): string {
    return 'Organization Profile';
  }

  turnOnEdit(): void {
    this.editOn = true;
  }

  submitSave(): void {

    if (this.originalStatus && this.isActive === 'Disabled') {
      this.dialogRef = this.dialog.open(DisableOrganizationDialogComponent, {data: {id: this.orgID, title: this.orgName}});
      this.dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateOrganization();
        }
      });
    } else {
      this.updateOrganization();
    }
  }

  updateOrganization(): void {
    this.organizationService.updateOrganization({
      org_id: this.orgID,
      org_name: this.orgName,
      address: this.location,
      status: this.isActive === this.activeStates[0]
    }).subscribe(() => {
      location.reload();
    }, err => {
      if (err.error && err.error.org_name) {
        this.orgError = 'An organization with this name already exists';
      }
    });
  }
}

interface DialogData {
  title: string;
  id: string;
}

@Component({
  selector: 'app-disable-organization-dialog',
  templateUrl: 'disable-organization-dialog.html',
  styleUrls: ['./organization.component.scss']
})
export class DisableOrganizationDialogComponent {

  textInput = '';

  constructor(
    public dialogRef: MatDialogRef<DisableOrganizationDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  disableOrganization(): void {
    this.dialogRef.close(this.data);
  }

}
