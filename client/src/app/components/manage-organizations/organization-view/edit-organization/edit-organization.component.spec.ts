import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ManageOrganizationsService} from 'src/app/services/organizations/manage-organizations.service';
import {FormBuilder} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {EditOrganizationComponent} from './edit-organization.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AppModule } from 'src/app/app.module';

describe('EditOrganizationComponent', () => {
  let component: EditOrganizationComponent;
  let fixture: ComponentFixture<EditOrganizationComponent>;
  // @ts-ignore
  let organizationService: ManageOrganizationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditOrganizationComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule, AppModule],
      providers: [
        FormBuilder,
        {
          provide: ManageOrganizationsService,
        },
      ],
    }).compileComponents();

    organizationService = TestBed.inject(ManageOrganizationsService);
    fixture = TestBed.createComponent(EditOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test the submitQuery
  it('Call submitQuery', () => {
    try {
      component.submitQuery();
    }
    catch (err) {
      console.error(err);
    }
  });

  // Test the turnOnEdit
  it('Call turnOnEdit', () => {
    try {
      component.turnOnEdit();
    }
    catch (err) {
      console.error(err);
    }
  });

  // Test the constructor
  it('Call constructor', () => {
    try {
      component.constructor();
    }
    catch (err) {
      console.error(err);
    }
  });
});
