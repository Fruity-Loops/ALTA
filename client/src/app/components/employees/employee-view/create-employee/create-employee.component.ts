import {Component, OnInit} from '@angular/core';
import {AuthService, LocalStorage} from 'src/app/services/authentication/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TokenService} from 'src/app/services/authentication/token.service';
import createMembersRoles from 'src/app/fixtures/create_members_roles.json';
import {BaseEmployeeForm, EmployeeView} from '../employee-view';

@Component({
  selector: 'app-signup',
  templateUrl: '../employee-view.component.html',
  styleUrls: ['../employee-view.component.scss'],
})
export class CreateEmployeeComponent extends EmployeeView implements OnInit {
  // Defining type of our form
  // @ts-ignore
  employeeForm: FormGroup;
  selectedOrganization: any = '';
  subscription: any;
  isEmployee = false;
  createMembersRoles = createMembersRoles;

  role: string | undefined;

  // Injecting the authService to be able to send data to the backend through it ,
  // fb for the formbuilder validations and Router to redirect to the desired component when registerd successfully
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private tokenService: TokenService
  ) {
    super();
    this.isLoaded();
  }

  ngOnInit(): void {
    this.subscription = this.authService.getOrgMode()
      .subscribe(orgMode => {
        if (orgMode) {
          this.selectedOrganization = this.authService.getLocalStorage(LocalStorage.OrgId);
          this.isEmployee = true;
        }
        this.init();
      });
  }

  getTitle(): string {
    return 'Profile Creation';
  }

  getIsEdit(): boolean {
    return false;
  }

  // We initialize the form and set validators to each one in case user forget to specify a field
  init(): void {
    this.employeeForm = this.fb.group({
      id: ['', Validators.required], // Each username,email,password is piped from the HTML using the "formControlName"
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      role: this.isEmployee ? ['', Validators.required] : undefined,
      location: this.isEmployee ? ['', Validators.required] : undefined,
    });
  }

  submitQuery(base: BaseEmployeeForm): void {

    const body = {
      ...base,
      role: this.employeeForm.value.role?.abbrev ? this.employeeForm.value.role.abbrev : 'SA',
      is_active: 'true',
      password: this.employeeForm.value.password,
      // parse the organization as an int to be sent to the backend
      organization: parseInt(this.selectedOrganization, 10),
    };

    // RegisterUser is the method defined in authService
    // If you are not logged in you can create any account
    const register = this.tokenService.GetToken()
      ? this.authService.register(body)
      : this.authService.openRegister(body);

    register.subscribe(
      () => {
        setTimeout(() => {
          // Redirect user to component in path:home (defined in alta-home-routing.module.ts)
          this.router.navigate(['modify-members']);
        }, 1000); // Waiting 1 second before redirecting the user
      },
      (err) => {
        // 2 different types of error messages
        // If email already exist
        if (err.error.email) {
          this.errorMessage = 'A member with that email address already exists';
        }

        // If username already exist
        if (err.error.user_name) {
          this.errorMessage = 'A member with that employee ID already exists';
        }
      }
    );
  }

  OnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
