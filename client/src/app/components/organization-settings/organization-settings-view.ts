import {FormGroup} from '@angular/forms';
import {Language} from '../../services/Language';
import {OrganizationSettingsLangFactory, OrgSettingsCategories} from './organization-settings.language';

export interface BaseOrganizationSettingsForm {
  time: string;
  interval: string;
  ftpLocation: string;
}

export abstract class OrganizationSettingsView {

  isEdit: boolean;
  loaded = false;
  errorMessage: string | undefined;
  title: string;
  categories: OrgSettingsCategories;

  orgSettingsForm: FormGroup | undefined;

  protected constructor() {
    this.isEdit = this.getIsEdit();
    const lang = new OrganizationSettingsLangFactory(Language.ENGLISH);
    [this.title, this.categories] = [lang.lang.title, lang.lang.categories];
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
