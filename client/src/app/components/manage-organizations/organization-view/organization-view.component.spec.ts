import { ComponentFixture, TestBed } from '@angular/core/testing';
import {OrganizationViewComponent} from './organization-view.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('OrganizationViewComponent', () => {
  let component: OrganizationViewComponent;
  // tslint:disable-next-line:prefer-const
  let fixture: ComponentFixture<OrganizationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationViewComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test the dialog window
  it('Call the dialog object', () => {
    try {
      component.submitSave()
    }
    catch (err) {
      expect(component.orgError).toBe('Please enter a name for the organization');
    }
  });
  

  

});
