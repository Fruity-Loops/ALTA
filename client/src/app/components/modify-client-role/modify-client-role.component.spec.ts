import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyClientRoleComponent } from './modify-client-role.component';
import { DashboardService } from './../../services/dashboard.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('ModifyClientRoleComponent', () => {
  let component: ModifyClientRoleComponent;
  let fixture: ComponentFixture<ModifyClientRoleComponent>;
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyClientRoleComponent],
      providers: [DashboardService],
      imports: [HttpClientModule]
    });

    fixture = TestBed.createComponent(ModifyClientRoleComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(DashboardService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

