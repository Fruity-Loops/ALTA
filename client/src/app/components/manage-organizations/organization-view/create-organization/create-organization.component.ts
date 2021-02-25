import {Component} from '@angular/core';
import {ManageOrganizationsService} from 'src/app/services/organizations/manage-organizations.service';
import {Router} from '@angular/router';
import {OrganizationViewComponent} from '../organization-view.component';

@Component({
  selector: 'app-create-organization',
  templateUrl: '../organization-view.component.html',
  styleUrls: ['../organization-view.component.scss'],
})
export class CreateOrganizationComponent extends OrganizationViewComponent {
  constructor(
    private organizationService: ManageOrganizationsService,
    private router: Router
  ) {
    super();
  }

  getEditInfo(): [boolean, boolean] {
    return [true, false]; // never changes
  }

  getComponentTitle(): string {
    return 'Organization Creation';
  }

  submitQuery(): void {
    this.locationInputOrFile();
    this.organizationService
      .createOrganization({
        org_name: this.orgName,
        address: this.locations,
        status: true,
      })
      .subscribe(
        () => {
          setTimeout(() => {
            // Redirect user back to list of templates
            this.router.navigate(['/manage-organizations']).then(() => {
            });
          }, 1000);
        },
        (err) => {
          if (err.error && err.error.org_name) {
            this.orgError = 'An organization with this name already exists';
          }
        }
      );
  }
}
