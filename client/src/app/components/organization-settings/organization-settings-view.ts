import {FormGroup} from "@angular/forms";

export interface BaseOrganizationSettingsForm {
  time: string,
  interval: string,
  ftpLocation: string,
}

export abstract class OrganizationSettingsView {

  isEdit: boolean;
  loaded = false;
  errorMessage: string | undefined;

  orgSettingsForm: FormGroup | undefined;

  protected constructor() {
    this.isEdit = this.getIsEdit();
  }

  abstract getIsEdit(): boolean;

  isLoaded(): void {
    this.loaded = true;
  }

  submitForm(): void {
    const body: any = {
      time: this.orgSettingsForm?.value.time,
      interval: this.orgSettingsForm?.value.interval,
      ftpLocation: this.orgSettingsForm?.value.ftpLocation,
      organization_id: [localStorage.getItem('organization_id')]
    }
    this.submitQuery(body);
  }

  abstract submitQuery(base: BaseOrganizationSettingsForm): void;

}
