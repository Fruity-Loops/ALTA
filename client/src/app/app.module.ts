import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './modules/auth/auth.module';
import { AltaMainModule } from './modules/alta-main/alta-main.module';
import { AltaMainRoutingModule } from './modules/alta-main-routing/alta-main-routing.module';
import { AuthRoutingModule } from './modules/auth-routing/auth-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/token-interceptor';
import { CookieService } from 'ngx-cookie-service';
import { MatModule } from './modules/material/material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AssignStockKeepersComponent } from './components/assign-stock-keepers/assign-stock-keepers.component';
import { ManageStockKeepersDesignationComponent } from './components/manage-stock-keepers-designation/manage-stock-keepers-designation.component';

@NgModule({
  declarations: [
    AppComponent,
    AssignStockKeepersComponent,
    ManageStockKeepersDesignationComponent,
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
  ],
  providers: [
    CookieService, // To manage cookie in frontend
    {
      provide: HTTP_INTERCEPTORS, // To be able to use the http interceptor in app
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
