import {FormGroup} from '@angular/forms';

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
  fieldLabels = {first_name: 'First Name', email: 'E-mail Address', last_name: 'Last Name', employee_id: 'Employee ID', role: 'Role',
    is_active: 'Is Active', password: 'Password', location: 'Employment Location'};
  fieldPlaceholders = {first_name: 'First name', email: 'E-mail address', last_name: 'Last name', employee_id: 'Employee ID',
    password: 'Password', location: 'Employment Location'};
  actionButtonLabels = {save: 'Save', edit: 'Edit', cancel: 'Cancel'};

  protected constructor() {
    this.title = this.getTitle();
    this.isEdit = this.getIsEdit();
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
