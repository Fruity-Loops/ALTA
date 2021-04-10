import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuditReportService } from './audit-report.service';

describe('AuditReportService', () => {
  let service: AuditReportService;
  // @ts-ignore
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuditReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
