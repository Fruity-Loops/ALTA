import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  body: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginUser(): void {
    this.body = {
      user_name: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.authService.login(this.body).subscribe(
      (data) => {
        this.tokenService.SetToken(data.token); // Setting token in cookie for logged in users
        // Set the logged in user's data for components to use when hiding or displaying elements
        this.authService.setNext(data.user_id, data.user, data.role, data.organization_id, data.organization_name);
        if (data.role === 'SA') {
          setTimeout(() => {
            this.authService.turnOffOrgMode();
            this.router.navigate(['manage-organizations']);
          }, 1000);
        } else {
          setTimeout(() => {
            this.authService.turnOnOrgMode(data.organization_id);
            this.router.navigate(['']); // Redirect user to component in path:home (defined in alta-home-routing.module.ts)
          }, 1000); // Redirect the user after 1 seconds ( in case we want to add a loading bar when we click on button )
        }
        this.successMessage = 'Login Successful';
        this.errorMessage = null;
        this.resetForm();
      },
      (err) => {
        if (err.error.detail) {
          this.errorMessage = err.error.detail;
        }
      }
    );
  }

  resetForm(): void {
    this.loginForm.reset();
    Object.keys(this.loginForm.controls).forEach((key) => {
      this.loginForm.controls[key].setErrors(null);
    });
  }
}
