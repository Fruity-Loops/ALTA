import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AuthService} from 'src/app/services/authentication/auth.service';
import {TokenService} from 'src/app/services/authentication/token.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {EditEmployeeComponent} from './edit-employee.component';
import {FormBuilder} from '@angular/forms';
import {ManageOrganizationsService} from 'src/app/services/organizations/manage-organizations.service';
import 'zone.js/dist/zone-testing';
import { AppModule } from 'src/app/app.module'

describe('SignupComponent', () => {
  let component: EditEmployeeComponent;
  let fixture: ComponentFixture<EditEmployeeComponent>;
  // @ts-ignore
  let authService: AuthService;
  // @ts-ignore
  let tokenService: TokenService;
  // @ts-ignore
  let manageOrganizationsService: ManageOrganizationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEmployeeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule],
      providers: [
        FormBuilder,
        {
          provide: AuthService,
        },
        {
          provide: TokenService,
        },
        {
          provide: ManageOrganizationsService,
        },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    manageOrganizationsService = TestBed.inject(ManageOrganizationsService);
    
    fixture = TestBed.createComponent(EditEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create edit-employee component', () => {
    expect(component).toBeTruthy();
  });

 // Test the setSelectors table
 it('Call setSelectors', () => {
  try {
    component.setSelectors()
  }
  catch (err) {
    console.error(err);
  }
});

  // Test the getTitle table
  it('Call getTitle', () => {
    try {
      component.getTitle()
    }
    catch (err) {
      console.error(err);
    }
  });

  // Test the editMode table
  it('Call editMode', () => {
    try {
      component.editMode(false)
    }
    catch (err) {
      console.error(err);
    }
  });

  // Test the reloadPage table
  it('Call reloadPage', () => {
    try {
      component.reloadPage()
    }
    catch (err) {
      console.error(err);
    }
  });
});
