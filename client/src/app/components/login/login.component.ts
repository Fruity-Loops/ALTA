import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
    this.authService.loginSysAdmin(this.loginForm.value).subscribe(
      (data) => {
        this.tokenService.SetToken(data.token); //setting token in cookie for logged in users
        setTimeout(() => {
          this.router.navigate(['home']); //If login successfull redirect user to component in path:home (defined in alta-home-routing.module.ts)
        }, 1000); // Redirect the user after 3 seconds ( in case we want to add a loading bar when we click on button )
        this.loginForm.reset();
      },
      (err) => {
        if (err.error.detail) {
          this.errorMessage = err.error.detail;
        }
      }
    );
  }
}
