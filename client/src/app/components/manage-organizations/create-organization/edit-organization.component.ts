import {Component, OnInit} from '@angular/core';
import {ManageOrganizationsService} from '../../../services/manage-organizations.service';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-edit-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class EditOrganizationComponent implements OnInit {

  isActive = 'Active';
  activeStates = ["Active", "Disabled"];
  isEdit = true;
  organizationTitle = 'Organization Profile';
  orgName: string;
  location: string;

  orgID: string;
  editOn = false;

  constructor(
    private organizationService: ManageOrganizationsService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(routeParams => {
      this.orgID = routeParams.ID;
      this.organizationService.getOneOrganization(this.orgID).subscribe(organization => {
        console.log(organization);
        this.isActive = organization.status? this.activeStates[0]: this.activeStates[1];
        this.orgName = organization.org_name;
        this.location = organization.address;
      });
    });
  }

  turnOnEdit(): void {
    this.editOn = true;
  }

  submitSave(): void {
    this.organizationService.updateOrganization({
      org_id: this.orgID,
      org_name: this.orgName,
      address: this.location,
      status: this.isActive === this.activeStates[0]
    }).subscribe(() => {
      location.reload();
    })
  }
}
