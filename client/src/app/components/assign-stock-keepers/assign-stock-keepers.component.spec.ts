import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignStockKeepersComponent } from './assign-stock-keepers.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { ManageAuditsService } from 'src/app/services/manage-audits.service';

describe('AssignStockKeepersComponent', () => {
  let component: AssignStockKeepersComponent;
  let fixture: ComponentFixture<AssignStockKeepersComponent>;
  //@ts-ignore
  let service: ManageMembersService;
  //@ts-ignore
  let service2: ManageAuditsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignStockKeepersComponent],
      providers: [ManageMembersService, ManageAuditsService],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignStockKeepersComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageMembersService);
    service2 = TestBed.inject(ManageAuditsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
