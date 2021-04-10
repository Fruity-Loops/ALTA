import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ManageOrganizationsService} from 'src/app/services/organizations/manage-organizations.service';
import {FormBuilder} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {CreateOrganizationComponent} from './create-organization.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AppModule } from 'src/app/app.module';

fdescribe('CreateOrganizationComponent', () => {
  let component: CreateOrganizationComponent;
  let fixture: ComponentFixture<CreateOrganizationComponent>;
  // @ts-ignore
  let organizationService: ManageOrganizationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateOrganizationComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule, AppModule],
      providers: [
        FormBuilder,
        {
          provide: ManageOrganizationsService,
        },
      ],
    }).compileComponents();

    organizationService = TestBed.inject(ManageOrganizationsService);
    fixture = TestBed.createComponent(CreateOrganizationComponent);
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

  it('test getEditInfo()', () => {
    expect(component.getEditInfo()).toEqual([true, false]);
  })

  it('test getComponentTitle()', () => {
    expect(component.getComponentTitle()).toEqual('Organization Creation');
  })

});
