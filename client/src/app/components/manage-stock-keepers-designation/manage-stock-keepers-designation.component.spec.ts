import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageStockKeepersDesignationComponent } from './manage-stock-keepers-designation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { ManageAuditsService } from 'src/app/services/manage-audits.service';

describe('AssignStockKeepersComponent', () => {
  let component: ManageStockKeepersDesignationComponent;
  let fixture: ComponentFixture<ManageStockKeepersDesignationComponent>;
  let service: ManageMembersService;
  let service2: ManageAuditsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageStockKeepersDesignationComponent],
      providers: [ManageMembersService, ManageAuditsService],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStockKeepersDesignationComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageMembersService);
    service2 = TestBed.inject(ManageAuditsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
