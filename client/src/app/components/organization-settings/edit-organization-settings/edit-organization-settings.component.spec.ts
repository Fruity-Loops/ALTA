import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import {OrganizationSettingsService} from 'src/app/services/organization-settings.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {EditOrganizationSettingsComponent} from './edit-organization-settings.component';
import { AppModule } from 'src/app/app.module'

describe('OrganizationSettingsComponent', () => {
  let component: EditOrganizationSettingsComponent;
  let fixture: ComponentFixture<EditOrganizationSettingsComponent>;
  // @ts-ignore
  let service: OrganizationSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOrganizationSettingsComponent],
      providers: [
        FormBuilder,
        { provide: OrganizationSettingsService}
      ],
      imports: [HttpClientTestingModule, MatSnackBarModule, AppModule]
    });

    fixture = TestBed.createComponent(EditOrganizationSettingsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(OrganizationSettingsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
