import { Component, Input, OnInit } from '@angular/core';
import { ManageMembersService } from '../../services/manage-members.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-employee-settings',
  templateUrl: './employee-settings.component.html',
  styleUrls: ['./employee-settings.component.scss'],
})
export class EmployeeSettingsComponent implements OnInit {
  @Input() employee: User;
  @Input() employeeCopy: User;
  edit = false;
  defaultPassword = '';
  password: string = this.defaultPassword;
  @Input() role: string;
  @Input() isActive: string;
  id: string;
  isLoggedInUser = false;
  body: any;
  signupForm: FormGroup;

  activeStates = [{ state: 'active' }, { state: 'disabled' }];
  roles = [
    { name: 'System Admin', abbrev: 'SA' },
    { name: 'Inventory Manager', abbrev: 'IM' },
    { name: 'Stock Keeper', abbrev: 'SK' },
  ];

  constructor(
    private manageMembersService: ManageMembersService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {
    // If the ID changes in the route param then reload the component
    this.activatedRoute.params.subscribe((routeParams) => {
        this.id = routeParams.ID? routeParams.ID: localStorage.getItem("id");
        this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.getEmployee();

    // Verifying that the logged in user is accessing his informations
    if (this.id === localStorage.getItem('id')) {
      this.isLoggedInUser = true;
    }

    this.signupForm = this.fb.group({
      username: ['', Validators.required], // Each username,email,password is piped from the HTML using the "formControlName"
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  getEmployee(): void {
    this.manageMembersService.getEmployee(this.id).subscribe((employee) => {
      this.employee = {
        id: employee.id,
        first_name: employee.first_name,
        last_name: employee.last_name,
        role: employee.role,
        is_active: employee.is_active,
        email: employee.email,
      };

      this.setSelectors();
    });
  }

  setSelectors(): void {
    this.isActive = this.employee.is_active ? 'active' : 'disabled';
    this.roles.forEach((role) => {
      if (role.abbrev === this.employee.role) {
        this.role = role.name;
      }
    });
  }

  editMode(turnOn: boolean): void {
    this.edit = turnOn;
    if (!turnOn) {
      this.submit();
    }
  }

  submit(): void {
    // update user info
    this.employee.is_active = this.isActive === 'active';

    this.roles.forEach((role) => {
      if (role.name === this.role) {
        this.employee.role = role.abbrev;
      }
    });

    this.manageMembersService
      .updateClientInfo(this.employee, this.id)
      .subscribe((response) => {
        location.reload();
      });

    // update user password
    if (this.password.length > 0) {
      this.body = {
        password: this.password,
      };
      this.manageMembersService.updatePassword(this.body, this.id).subscribe(
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
