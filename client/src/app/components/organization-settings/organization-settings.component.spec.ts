import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule} from "@angular/common/http";
import { FormBuilder } from "@angular/forms";
import {OrganizationSettingsService} from "../../services/organization-settings.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {EditOrganizationSettingsComponent} from "./edit-organization-settings/edit-organization-settings.component";

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
      imports: [HttpClientModule, MatSnackBarModule]
    });

    fixture = TestBed.createComponent(EditOrganizationSettingsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(OrganizationSettingsService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
