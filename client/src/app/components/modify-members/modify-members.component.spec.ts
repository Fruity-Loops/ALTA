import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyMembersComponent } from './modify-members.component';
import { HttpClientModule } from '@angular/common/http';
import { ManageMembersService } from 'src/app/services/manage-members.service';

describe('ModifyMembersComponent', () => {
  let component: ModifyMembersComponent;
  let fixture: ComponentFixture<ModifyMembersComponent>;
  let service: ManageMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyMembersComponent],
      providers: [ManageMembersService],
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
