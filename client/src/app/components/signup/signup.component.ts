import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  //defining type of our form
  signupForm: FormGroup;
  errorMessage: string;
  body: any;
  showSpinner = false;

  //injecting the authService to be able to send data to the backend through it , fb for the formbuilder validations and ROuter to redirect to the desired component when registerd successfully
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.init();
  }

  //we initialize the form and set validators to each one in case user forget to specify a field
  init() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required], //each username,email,password is piped from the HTML using the "formControlName"
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
    });
  }

  signupUser() {
    this.showSpinner = true;
    console.log(this.signupForm.value.username);
    this.body = {
      user_name: this.signupForm.value.username,
      email: this.signupForm.value.email,
      first_name: this.signupForm.value.firstname,
      last_name: this.signupForm.value.lastname,
      role: 'SA',
      is_active: 'true',
      password: this.signupForm.value.password,
    };

    //registerUser is the method defined in authService
    this.authService.registerSysAdmin(this.body).subscribe(
      (data) => {
        console.log(data.token);
        this.signupForm.reset(); //Reset form once signup
        // setTimeout(() => {
        //   this.router.navigate(['streams']); //If signup successfull redirect user to component in path:streams (defined in streams-routing.module.ts)
        // }, 3000);
      },
      (err) => {
        this.showSpinner = false;

        //2 different types of error messages
        //if email already exist
        if (err.error.email) {
          this.errorMessage = err.error.email[0];
        }

        //if username already exist
        if (err.error.user_name) {
          this.errorMessage = err.error.user_name[0];
        }
      }
    );
  }
}
