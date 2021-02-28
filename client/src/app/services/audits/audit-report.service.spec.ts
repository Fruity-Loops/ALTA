import { TestBed } from '@angular/core/testing';

import { AuditReportService } from './audit-report.service';

describe('AuditReportService', () => {
  let service: AuditReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
