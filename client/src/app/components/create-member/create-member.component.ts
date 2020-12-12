import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResolveStart, Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import roles from '../../models/roles.json';

@Component({
  selector: 'app-signup',
  templateUrl: './create-member.component.html',
  styleUrls: ['./create-member.component.scss'],
})
export class CreateMemberComponent implements OnInit {
  // Defining type of our form
  signupForm: FormGroup;
  errorMessage: string;
  body: any;
  selectedOrganization: any = '';
  signUpButtonLabel = 'Save';
  subscription;
  isEmployee = false;
  roles = roles;

  // Injecting the authService to be able to send data to the backend through it ,
  // fb for the formbuilder validations and Router to redirect to the desired component when registerd successfully
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.subscription = this.authService.getOrgMode()
      .subscribe(orgMode => {
        if (orgMode) {
          this.selectedOrganization = localStorage.getItem('organization_id');
          this.isEmployee = true;
        }
        this.init();
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
      role: this.isEmployee ? ['', Validators.required] : undefined,
      location: this.isEmployee ? ['', Validators.required] : undefined,
    });
  }

  signupUser(): void {
    this.body = {
      user_name: this.signupForm.value.username,
      email: this.signupForm.value.email,
      first_name: this.signupForm.value.firstname,
      last_name: this.signupForm.value.lastname,
      location: this.signupForm.value.location === undefined ? null : this.signupForm.value.location,
      role: this.signupForm.value.role?.abbrev ? this.signupForm.value.role.abbrev : 'SA',
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
      () => {
        this.signupForm.reset(); // Reset form once create-member
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

  OnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
