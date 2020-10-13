import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyMembersComponent } from './modify-members.component';
import { DashboardService } from './../../services/dashboard.service';
import { HttpClientModule } from '@angular/common/http';

describe('ModifyMembersComponent', () => {
  let component: ModifyMembersComponent;
  let fixture: ComponentFixture<ModifyMembersComponent>;
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyMembersComponent],
      providers: [DashboardService],
      imports: [HttpClientModule]
    });

    fixture = TestBed.createComponent(ModifyMembersComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(DashboardService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
