import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './modules/auth/auth.module';
import { AltaMainModule } from './modules/alta-main/alta-main.module';
import { AltaMainRoutingModule } from './modules/alta-main-routing/alta-main-routing.module';
import { AuthRoutingModule } from './modules/auth-routing/auth-routing.module';
import { TokenInterceptor } from './services/authentication/token-interceptor';
import { CookieService } from 'ngx-cookie-service';
import { MatModule } from './modules/material/material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuditReportComponent } from './components/audit-report/audit-report.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FileUploadModule} from 'ng2-file-upload';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    AuditReportComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,
    AltaMainModule,
    AltaMainRoutingModule,
    AuthRoutingModule,
    HttpClientModule,
    MatModule,
    FlexLayoutModule,
    MatSnackBarModule,
    FileUploadModule
  ],
  providers: [
    CookieService, // To manage cookie in frontend
    {
      provide: HTTP_INTERCEPTORS, // To be able to use the http interceptor in app
      useClass: TokenInterceptor,
      multi: true,
    },
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
