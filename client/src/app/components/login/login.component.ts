import {Component, Inject, OnInit, Optional} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/authentication/token.service';
import { ManageMembersService } from 'src/app/services/users/manage-members.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LoginLangFactory} from './login.language';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // @ts-ignore
  loginForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  body: any;
  panelOpenState = false;
  dialogRef: any;

  email: string;
  password: string;
  loginBtnLabel: string;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
    private userService: ManageMembersService,
    private dialog: MatDialog
  ) {
    this.errorMessage = '';
    this.successMessage = '';

    const lang = new LoginLangFactory();
    [this.email, this.password, this.loginBtnLabel] = [lang.lang.email, lang.lang.password, lang.lang.loginBtnLabel];
  }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
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

  openForgotCredentials(): void {
    this.dialogRef = this.dialog.open(ForgotCredentialsComponent, {data: {
        fb: this.fb,
        userService: this.userService
      }
    });
  }
}

interface ForgotCredentialsData {
  fb: FormBuilder;
  userService: ManageMembersService;
}

@Component({
  selector: 'app-forgot-credentials-component',
  templateUrl: 'login.forgotcredentials.html',
  styleUrls: ['login.component.scss']
})
export class ForgotCredentialsComponent {
  // @ts-ignore
  resetPasswordForm: FormGroup;
  fb: FormBuilder;
  userService: ManageMembersService;
  success = false;
  emailNoExist = false;

  constructor(
    public dialogRef: MatDialogRef<ForgotCredentialsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ForgotCredentialsData) {
    this.fb = data.fb;
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.userService = data.userService;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  disableOrganization(): void {
    this.dialogRef.close();
  }

  resetPassword(): void {
    const body = {
      email: this.resetPasswordForm.value.email,
    };

    this.userService.resetPassword(body).subscribe(() => {
      this.success = true;
      setTimeout( () => {
        this.resetPasswordForm.reset();
        this.closeDialog();
      }, 5000);
    }, (err) => {
      if (err.status === 404) {
        this.emailNoExist = true;
      }
    });
  }

}
