import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  formGroup: FormGroup;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async signin() {
    const whileLoading = await this.loadingController.create();
    await whileLoading.present();
    this.authService.setEmail(this.formGroup.value.email);

    this.authService.signin(this.formGroup.value).subscribe(
      async (res) => {
        await whileLoading.dismiss();
        this.router.navigateByUrl('login', { replaceUrl: true });
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
}
