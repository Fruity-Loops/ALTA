import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewAuditComponent } from './review-audit.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageMembersService } from 'src/app/services/users/manage-members.service';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AppModule } from 'src/app/app.module';

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
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule, AppModule ],
    });
    fixture = TestBed.createComponent(ReviewAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component = null;
    fixture = null;
  })

  it('should create Review Audit s Component', () => {
    expect(component).toBeTruthy();
  });
});
