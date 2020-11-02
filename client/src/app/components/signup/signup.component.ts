import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { CurrentUserService } from 'src/app/services/current-user.service';
import { ManageOrganizationsService } from 'src/app/services/manage-organizations.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  // Defining type of our form
  signupForm: FormGroup;
  errorMessage: string;
  body: any;
  organizations: any = [];
  selectedOrganization: any;
  signUpButtonLabel = 'Register Account'
  currentRole;  //
  subscription;  //
  roles = [
    { name: 'Inventory Manager', abbrev: 'IM' },
    { name: 'Stock Keeper', abbrev: 'SK' },
  ];

  // Injecting the authService to be able to send data to the backend through it ,
  // fb for the formbuilder validations and Router to redirect to the desired component when registerd successfully
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private tokenService: TokenService,
    private organizationsService: ManageOrganizationsService,
    private currentUser: CurrentUserService
  ) { }

  ngOnInit(): void {
    this.init();
    this.subscription = this.currentUser.sharedUser
      .subscribe((data) => {
        this.currentRole = data.role;
        if(this.currentRole == 'SA') {
            this.roles = [
              { name: 'System Admin', abbrev: 'SA' },
              { name: 'Inventory Manager', abbrev: 'IM' },
              { name: 'Stock Keeper', abbrev: 'SK' },
            ];
        }
      });
  }

  // We initialize the form and set validators to each one in case user forget to specify a field
  init(): void {
    this.signupForm = this.fb.group({
      username: ['', Validators.required], // Each username,email,password is piped from the HTML using the "formControlName"
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      role: ['', Validators.required],
      organization: [''],
    });

    if (this.tokenService.GetToken()) {
      this.getAllOrganizations();
    }

  }

  signupUser(): void {
    if (this.signupForm.value.organization.org_id) {
      this.selectedOrganization = this.signupForm.value.organization.org_id;
    } else {
      this.selectedOrganization = '';
    }

    this.body = {
      user_name: this.signupForm.value.username,
      email: this.signupForm.value.email,
      first_name: this.signupForm.value.firstname,
      last_name: this.signupForm.value.lastname,
      role: this.signupForm.value.role.abbrev,
      is_active: 'true',
      password: this.signupForm.value.password,
      organization: this.selectedOrganization,
    };
    // RegisterUser is the method defined in authService
    // If you are not logged in you can create any account
    const register = this.tokenService.GetToken()
      ? this.authService.register(this.body)
      : this.authService.openRegister(this.body);

    register.subscribe(
      (data) => {
        this.tokenService.SetToken(data.token);
        this.signupForm.reset(); // Reset form once signup
        setTimeout(() => {
          // Redirect user to component in path:home (defined in alta-home-routing.module.ts)
          this.router.navigate(['modify-members']);
        }, 1000); // Waiting 1 second before redirecting the user
        this.resetForm();

      },
      (err) => {
        // 2 different types of error messages
        // If email already exist
        if (err.error.email) {
          this.errorMessage = err.error.email[0];
        }

        // If username already exist
        if (err.error.user_name) {
          this.errorMessage = err.error.user_name[0];
        }
      }
    );
  }

  resetForm(): void {
    this.signupForm.reset();
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.controls[key].setErrors(null);
    });
  }

  getAllOrganizations(): void {
    this.organizationsService.getAllOrganizations().subscribe(
      (data) => {
        this.organizations = data;
        this.errorMessage = '';
      },
      (err) => {
        this.errorMessage = err.error ? err.error.detail : err.statusText;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
