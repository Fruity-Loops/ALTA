import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/authentication/token.service';
import { ManageMembersService } from 'src/app/services/users/manage-members.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // @ts-ignore
  loginForm: FormGroup;
  // @ts-ignore
  resetPasswordForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  body: any;
  panelOpenState = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
    private userService: ManageMembersService
  ) {
    this.errorMessage = '';
    this.successMessage = '';
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  loginUser(): void {
    this.body = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService.login(this.body).subscribe(
      (data) => {
        this.tokenService.SetToken(data.token); // Setting token in cookie for logged in users
        this.populateUserInfo(data, true);
        this.successMessage = 'Login Successful';
        this.errorMessage = '';
        this.resetForm();
      },
      (err) => {
        if (err.error.detail) {
          this.errorMessage = err.error.detail;
        }
      }
    );
  }

  populateUserInfo(data: any, fromLogin: boolean): void {
    // Set the logged in user's data for components to use when hiding or displaying elements
    this.authService.setNext(
      data.user_id,
      data.user,
      data.role,
      data.organization_id,
      data.organization_name
    );
    if (data.role === 'SA') {
      setTimeout(() => {
        this.authService.turnOffOrgMode();
        if (fromLogin) {
          this.router.navigate(['manage-organizations']);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        this.authService.turnOnOrgMode(
          { organization: data.organization_id, ...data },
          true
        );
        if (fromLogin) {
          this.router.navigate(['']); // Redirect user to component in path:home (defined in alta-home-routing.module.ts)
        }
      }, 1000); // Redirect the user after 1 seconds ( in case we want to add a loading bar when we click on button )
    }
  }

  resetForm(): void {
    this.loginForm.reset();
    Object.keys(this.loginForm.controls).forEach((key) => {
      this.loginForm.controls[key].setErrors(null);
    });
  }

  resetPassword(): void {
    this.body = {
      email: this.resetPasswordForm.value.email,
    };

    this.userService.resetPassword(this.body).subscribe((data) => {
      this.resetPasswordForm.reset();
      this.panelOpenState = false;
    });
  }
}
