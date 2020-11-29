import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formGroup: FormGroup;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async login() {
    const whileLoading = await this.loadingController.create();
    await whileLoading.present();

    this.authService.login(this.formGroup.value).subscribe(
      async (res) => {
        await whileLoading.dismiss();
        this.router.navigateByUrl('', { replaceUrl: true });
      },
      async (res) => {
        await whileLoading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: res.error.detail,
          buttons: ['Dismiss'],
        });
        await alert.present();
      }
    );
  }

  get email() {
    return this.formGroup.get('email');
  }

  get password() {
    return this.formGroup.get('password');
  }

}
