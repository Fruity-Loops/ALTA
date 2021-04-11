import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import {OrganizationSettingsService} from 'src/app/services/organization-settings.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {EditOrganizationSettingsComponent} from './edit-organization-settings.component';
import { AppModule } from 'src/app/app.module';
import {of} from "rxjs";

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

    service = TestBed.inject(OrganizationSettingsService);
    fixture = TestBed.createComponent(EditOrganizationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('test currentFile', () => {
    spyOn(service, 'getOrganization').and.returnValue(of({
        "org_id": 1,
        "org_name": "test",
        "address": "['Florida']",
        "status": true,
        "inventory_items_refresh_job": 1,
        "calendar_date": "2021/01/01",
        "file": "files/data.csv",
        "ftp_location": "ftp@ftp.com",
        "repeat_interval": "days"
      }
    ));
    component.getOrganization();
    expect(component.currentFile).toEqual("data.csv");
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test getIsEdit', () => {
    expect(component.getIsEdit()).toBe(true);
  });

  it('test editMode', () => {
    component.getOrganization();
    expect(component.edit).toBe(false);
  });

  it('test getFile return null', () => {
    expect(component.getFile()).toEqual(null);
  });
});
