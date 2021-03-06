import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ManageOrganizationsService} from 'src/app/services/organizations/manage-organizations.service';
import {FormBuilder} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {ManageOrganizationsComponent} from './manage-organizations.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AppModule } from 'src/app/app.module';

describe('ManageOrganizationsComponent', () => {
  let component: ManageOrganizationsComponent;
  let fixture: ComponentFixture<ManageOrganizationsComponent>;
  // @ts-ignore
  let organizationService: ManageOrganizationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageOrganizationsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule, AppModule],
      providers: [
        FormBuilder,
        {
          provide: ManageOrganizationsService,
        },
      ],
    }).compileComponents();

    organizationService = TestBed.inject(ManageOrganizationsService);
    fixture = TestBed.createComponent(ManageOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    organizationService = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
