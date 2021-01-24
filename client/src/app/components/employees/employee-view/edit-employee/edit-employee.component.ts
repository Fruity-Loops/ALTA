import { Component, Input, OnInit } from '@angular/core';
import { ManageMembersService } from '../../../../services/manage-members.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../models/user.model';
import roles from 'src/app/fixtures/roles.json';
import { EmployeeView } from '../employee-view';
import { BehaviorSubject } from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-employee-settings',
  templateUrl: '../employee-view.component.html',
  styleUrls: ['../employee-view.component.scss'],
})
export class EditEmployeeComponent extends EmployeeView implements OnInit {
  @Input() employee: any;
  edit = false;
  password: string = '';
  @Input() role: string;
  @Input() isActive: string;
  id: string;
  isLoggedInUser: BehaviorSubject<boolean>;
  isSystemAdmin = false;

  always_disabled = ['email', 'id'];

  activeStates = [{ state: 'active' }, { state: 'disabled' }];
  roles = roles;

  employeeForm: FormGroup;
  isEdit = true;
  errorMessage: string;

  constructor(
    private manageMembersService: ManageMembersService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    super();
    // If the ID changes in the route param then reload the component
    this.activatedRoute.params.subscribe((routeParams) => {
      this.id = routeParams.ID ? routeParams.ID : localStorage.getItem('id');
      this.ngOnInit();
    });
  }

  getTitle(): string {
    // need to initialize here because the super constructor needs to be the first thing that gets called
    this.isLoggedInUser = new BehaviorSubject(false);
    const generateString = () => (this.isLoggedInUser.getValue() ? "Profile" : "Employee") +  " Settings";

    // put a subscription in case of changes for whether the user is logged in or not
    this.isLoggedInUser.subscribe(_ => {
      this.title = generateString();
    });
    return generateString();
  }

  ngOnInit(): void {
    this.getEmployee();

    // Verifying that the logged in user is accessing his informations
    if (this.id === localStorage.getItem('id')) {
      this.isLoggedInUser.next(true);
    }
  }

  getEmployee(): void {
    this.manageMembersService.getEmployee(this.id).subscribe((employee) => {
      this.employee = {
        role: employee.role,
        is_active: employee.is_active,
      };
      this.setSelectors();
      this.employeeForm = this.fb.group({
        // Each username,email,password is piped from the HTML using the "formControlName"
        id: new FormControl({value: employee.id, disabled: !this.edit}, [Validators.required]),
        email: new FormControl({value: employee.email, disabled: !this.edit}, [Validators.email, Validators.required]),
        first_name: new FormControl({value: employee.first_name, disabled: !this.edit}, [Validators.required]),
        last_name: new FormControl({value: employee.last_name, disabled: !this.edit}, [Validators.required]),
        location: !this.isSystemAdmin ?
          new FormControl({value: employee.location, disabled: !this.isSystemAdmin}, [Validators.required]) :
          undefined,
      });
      this.isLoaded();
    });
  }

  setSelectors(): void {
    this.isActive = this.employee.is_active ? 'active' : 'disabled';
    if (this.employee.role === 'SA') {
      this.isSystemAdmin = true;
    } else {
      this.roles = this.roles.filter(({ abbrev}) => abbrev !== 'SA');
    }

    this.roles.forEach((role) => {
      if (role.abbrev === this.employee.role) {
        this.role = role.name;
      }
    });
  }

  editMode(turnOn: boolean): void {
    this.edit = turnOn;
    Object.keys(this.employeeForm.controls).forEach(key => {
      if (this.always_disabled.indexOf(key) < 0) this.employeeForm.controls[key].enable();
    });
    if (!turnOn) {
      this.submitForm();
    }
  }

  // Will be used to reload (refresh) the page when the cancel button is clicked
  reloadPage(): void {
    window.location.reload();
  }

  submitForm(): void {
    // update user info
    this.employee.is_active = this.isActive === 'active';

    this.roles.forEach((role) => {
      if (role.name === this.role) {
        this.employee.role = role.abbrev;
      }
    });

    let body: any = {
      user_name: this.employeeForm.value.username,
      email: this.employeeForm.value.email,
      first_name: this.employeeForm.value.firstname,
      last_name: this.employeeForm.value.lastname,
      password: this.employeeForm.value.password,
      location: this.employeeForm.value.location
    };

    // employee info needs to be overridden/replaced by the body of the form, since it's not updated by user input
    const patchedEmployee = {...this.employee, ...body};

    delete patchedEmployee.id;
    delete patchedEmployee.email;

    this.manageMembersService
      .updateClientInfo(patchedEmployee, this.id)
      .subscribe((response) => {
        location.reload();
      });

    // update user password
    if (this.password.length > 0) {
      body = {
        password: this.password,
      };
      this.manageMembersService.updatePassword(body, this.id).subscribe(
        (response) => {
          location.reload();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
