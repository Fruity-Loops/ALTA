import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EmployeeListComponent} from './employee-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ManageMembersService} from 'src/app/services/users/manage-members.service';
import {RouterTestingModule} from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';

describe('ClientGridViewComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  // @ts-ignore
  let service: ManageMembersService;
  let createBtn: HTMLButtonElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      providers: [
        ManageMembersService,
        FormBuilder,
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule],
    });
    service = TestBed.inject(ManageMembersService);
    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    service = null;
  });

  it('should create Client grid view component', () => {
    expect(component).toBeTruthy();
  });

   // Test that Start Audit button is disabled when no items selected
  it('Create button should be active', () => {
    fixture.detectChanges();
    createBtn = fixture.debugElement.query(By.css('#create')).nativeElement;
    expect(createBtn.disabled).toBeFalsy();
  });

  // Test the applyFilter()
  it('Call method', () => {
    component.applyFilter('');
  });

  // Test the updatePaginator()
  it('Call updatePaginator method', () => {
    component.userData = {count: 0};
    component.updatePaginator();
  });

  // Test the updatePage()
  it('Call updatePage method', () => {
    component.updatePage();
  });

  // Test the applyFilter()
  it('Call applyFilter method', () => {
    component.applyFilter('');
  });

/*
* The test below is commented out is to show as an example how to setup test
*/

  // Test the populateTable()
  // it('Call method', () => {
  //   try {
  //     component.populateTable([{
  //       first_name: 'Nick',
  //       last_name: 'Nick',
  //       role: 'SA',
  //       is_active: true,
  //       id: 2,
  //       email: 'nick@test.com',
  //       location: 'Terrebonne',
  //     }]);
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  // });

});
