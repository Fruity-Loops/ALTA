import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewAuditComponent } from './review-audit.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageMembersService } from 'src/app/services/users/manage-members.service';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

describe('AssignStockKeepersComponent', () => {
  let component: ReviewAuditComponent;
  let fixture: ComponentFixture<ReviewAuditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewAuditComponent],
      providers: [
        FormBuilder,
        { provide: ManageMembersService },
        { provide: ManageAuditsService }
      ],
      imports: [HttpClientModule, RouterTestingModule, MatDialogModule ],
    });

    fixture = TestBed.createComponent(ReviewAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Review Audit s Component', () => {
    expect(component).toBeTruthy();
  });
});
