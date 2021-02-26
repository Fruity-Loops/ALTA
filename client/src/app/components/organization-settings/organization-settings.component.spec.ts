import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule} from "@angular/common/http";
import { OrganizationSettingsComponent } from './organization-settings.component';
import { FormBuilder } from "@angular/forms";
import {OrganizationSettingsService} from "../../services/organization-settings.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('OrganizationSettingsComponent', () => {
  let component: OrganizationSettingsComponent;
  let fixture: ComponentFixture<OrganizationSettingsComponent>;
  // @ts-ignore
  let service: OrganizationSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationSettingsComponent],
      providers: [
        FormBuilder,
        { provide: OrganizationSettingsService}
      ],
      imports: [HttpClientModule, MatSnackBarModule]
    });

    fixture = TestBed.createComponent(OrganizationSettingsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(OrganizationSettingsService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
