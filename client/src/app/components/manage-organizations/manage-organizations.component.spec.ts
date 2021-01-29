import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ManageOrganizationsService} from 'src/app/services/manage-organizations.service';
import {FormBuilder} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {ManageOrganizationsComponent} from './manage-organizations.component';
import {MatDialogModule} from '@angular/material/dialog';

describe('ManageOrganizationsComponent', () => {
  let component: ManageOrganizationsComponent;
  let fixture: ComponentFixture<ManageOrganizationsComponent>;
  // @ts-ignore
  let organizationService: ManageOrganizationsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOrganizationsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule],
      providers: [
        FormBuilder,
        {
          provide: ManageOrganizationsService,
        },
      ],
    }).compileComponents();

    organizationService = TestBed.inject(ManageOrganizationsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
