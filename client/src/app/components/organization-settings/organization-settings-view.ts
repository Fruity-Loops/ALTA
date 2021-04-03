import {FormGroup} from '@angular/forms';

export interface BaseOrganizationSettingsForm {
  time: string;
  interval: string;
  ftpLocation: string;
}

export abstract class OrganizationSettingsView {

  isEdit: boolean;
  loaded = false;
  errorMessage: string | undefined;
  title = 'Organization Settings';
  categories = {
    inventory_extractions: {
      title: 'Inventory Extractions',
      fieldLabels: {ftp_location: 'FTP Location', repeat_every: 'Repeat Every', upload_extract: 'Upload Inventory Extract',
        current_file: 'Current File', drop_file: 'Drop .csv here', repeat_options: {minutes: 'Minutes', hours: 'Hours',
        days: 'Days', weeks: 'Weeks'}}
    }
  };

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
    };
    this.submitQuery(body);
  }

  abstract submitQuery(base: BaseOrganizationSettingsForm): void;

}
