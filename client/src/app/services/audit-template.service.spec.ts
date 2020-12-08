import { TestBed } from '@angular/core/testing';

import { AuditTemplateService } from './audit-template.service';

describe('AuditTemplateService', () => {
  let service: AuditTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
