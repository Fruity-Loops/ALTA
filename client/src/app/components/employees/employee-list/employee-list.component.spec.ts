import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EmployeeListComponent} from './employee-list.component';
import {HttpClientModule} from '@angular/common/http';
import {ManageMembersService} from 'src/app/services/users/manage-members.service';
import {RouterTestingModule} from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';

describe('ClientGridViewComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  // @ts-ignore
  let service: ManageMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      providers: [
        ManageMembersService,
        FormBuilder,
      ],
      imports: [HttpClientModule, RouterTestingModule],
    });

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageMembersService);
    fixture.detectChanges();
  });

  it('should create Client grid view component', () => {
    expect(component).toBeTruthy();
  });
});
