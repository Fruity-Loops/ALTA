import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentComponent } from './comment.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AuditReportService} from '../../../services/audits/audit-report.service';
import {ManageMembersService} from '../../../services/users/manage-members.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentComponent ],
      imports: [HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: AuditReportService
        },
        {
          provide: ManageMembersService
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
