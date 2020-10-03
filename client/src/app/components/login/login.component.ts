import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

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
    private authService: AuthService,
    private tokenService: TokenService
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
        this.tokenService.SetToken(data.token); //setting token in cookie for logged in users
        this.loginForm.reset();

        console.log(this.tokenService.GetToken());
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
