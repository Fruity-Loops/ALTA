import { ComponentFixture, TestBed } from '@angular/core/testing';
import {AuditReportService} from 'src/app/services/audits/audit-report.service';
import {ManageAuditsService} from 'src/app/services/audits/manage-audits.service';
import {ManageMembersService} from 'src/app/services/users/manage-members.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { AuditReportComponent } from './audit-report.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import {DatePipe} from '@angular/common';
import { AppModule } from 'src/app/app.module'

describe('AuditReportComponent', () => {
  let component: AuditReportComponent;
  let fixture: ComponentFixture<AuditReportComponent>;
  // @ts-ignore
  let service: ManageAuditsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditReportComponent ],
      providers: [
        FormBuilder,
        DatePipe,
        { provide:
            AuditReportService,
            ManageAuditsService,
            ManageMembersService
        },
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditReportComponent ],
      providers: [
        FormBuilder,
        DatePipe,
        { provide:
            AuditReportService,
            ManageAuditsService,
            ManageMembersService
        },
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule]
    });

    fixture = TestBed.createComponent(AuditReportComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageAuditsService);
    fixture.detectChanges();
  });

  afterEach(() => {
    service = null;
    fixture = null;
    component = null;
  });

  it('should create Audit Report Component', () => {
    expect(component).toBeTruthy();
  });

  it('test handleStatusFlag()', () => {
    component.handleStatusFlag('Active');
    component.handleStatusFlag('Pending');
  });

  it('test setDisplayedMetaColumns()', () => {
    component.setDisplayedMetaColumns({temp_key: 1});
  });

  it('test cleanMetaData()', () => {
    spyOn(component, 'setDisplayedMetaColumns').and.callFake(() => {});
    // spyOn(component.displayedMetaColumns, 'filter').and.callFake(() => []);
    component.metaData = {inventory_items: {}, assigned_sk: []};
    component.cleanMetaData();
  });
});
