import {FormGroup} from '@angular/forms';
import {EmployeeViewActionLabels, EmployeeViewLabels, EmployeeViewLangFactory, EmployeeViewPlaceHolders} from './employee-view.language';

export interface BaseEmployeeForm {
  user_name: string;
  email: string;
  first_name: string;
  last_name: string;
  location: string;
}

export abstract class EmployeeView {

  title: string;
  loaded = false;
  isEdit: boolean;
  errorMessage: string | undefined;

  employeeForm: FormGroup | undefined;
  fieldLabels: EmployeeViewLabels;
  fieldPlaceholders: EmployeeViewPlaceHolders;
  actionButtonLabels: EmployeeViewActionLabels;

  protected constructor() {
    this.title = this.getTitle();
    this.isEdit = this.getIsEdit();
    const lang = new EmployeeViewLangFactory();
    [this.fieldLabels, this.fieldPlaceholders, this.actionButtonLabels] = [lang.lang.fieldLabels, lang.lang.fieldPlaceholders,
      lang.lang.actionLabels];
  }

  abstract getTitle(): string;
  abstract getIsEdit(): boolean;

  // Needs to be called to load up the component and display the form
  isLoaded(): void {
    this.loaded = true;
  }

  submitForm(): void {
    const body: any = {
      user_name: this.employeeForm?.value.id,
      email: this.employeeForm?.value.email,
      first_name: this.employeeForm?.value.first_name,
      last_name: this.employeeForm?.value.last_name,
      location: this.employeeForm?.value.location,
    };

    this.submitQuery(body);

  }

  abstract submitQuery(base: BaseEmployeeForm): void;

}
