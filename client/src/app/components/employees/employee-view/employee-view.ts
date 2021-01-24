import {FormGroup} from '@angular/forms';

interface BaseEmployeeForm {
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
  errorMessage: string;

  employeeForm: FormGroup;

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
      user_name: this.employeeForm.value.id,
      email: this.employeeForm.value.email,
      first_name: this.employeeForm.value.first_name,
      last_name: this.employeeForm.value.last_name,
      location: this.employeeForm.value.location,
    }

    this.submitQuery(body);

  }

  abstract submitQuery(base: BaseEmployeeForm): void;

}
