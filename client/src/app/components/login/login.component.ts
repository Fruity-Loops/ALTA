import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
// import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;
  showSpinner = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginUser() {
    this.showSpinner = true;
    this.authService.loginSysAdmin(this.loginForm.value).subscribe(
      (data) => {
        console.log('From login' + data.token);
        this.loginForm.reset();
      },
      (err) => {
        console.log(err);
        this.showSpinner = false;
        if (err.error.message) {
          this.errorMessage = err.error.message;
        }
      }
    );
  }
}
