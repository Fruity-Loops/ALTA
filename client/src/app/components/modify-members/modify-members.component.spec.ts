import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyMembersComponent } from './modify-members.component';
import { HttpClientModule } from '@angular/common/http';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

describe('ModifyMembersComponent', () => {
  let component: ModifyMembersComponent;
  let fixture: ComponentFixture<ModifyMembersComponent>;
  let service: ManageMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyMembersComponent],
      providers: [ManageMembersService, HttpClient, FormBuilder],
      imports: [HttpClientModule]
    });

    fixture = TestBed.createComponent(ModifyMembersComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageMembersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
