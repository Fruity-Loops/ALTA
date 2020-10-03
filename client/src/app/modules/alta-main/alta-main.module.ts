import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/components/home/home.component';
import { AuthService } from 'src/app/services/auth.service';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  providers: [AuthService],
})
export class AltaMainModule {}
