import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  // Defining type of our form
  signupForm: FormGroup;
  errorMessage: string;
  body: any;
  roles = [
    { name: 'System Admin', abbrev: 'SA' },
    { name: 'Inventory Manager', abbrev: 'IM' },
    { name: 'Stock Keeper', abbrev: 'SK' },
  ];

  // Injecting the authService to be able to send data to the backend through it ,
  // fb for the formbuilder validations and Router to redirect to the desired component when registerd successfully
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.init();
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
    });
  }

  signupUser(): void {
    this.body = {
      user_name: this.signupForm.value.username,
      email: this.signupForm.value.email,
      first_name: this.signupForm.value.firstname,
      last_name: this.signupForm.value.lastname,
      role: this.signupForm.value.role.abbrev,
      is_active: 'true',
      password: this.signupForm.value.password,
    };
    // RegisterUser is the method defined in authService
    this.authService.register(this.body).subscribe(
      (data) => {
        this.tokenService.SetToken(data.token);
        this.signupForm.reset(); // Reset form once signup
        setTimeout(() => {
          this.router.navigate(['modify-members']); // Redirect user to component in path:home (defined in alta-home-routing.module.ts)
        }, 1000); // Waiting 1 second before redirecting the user
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
}
