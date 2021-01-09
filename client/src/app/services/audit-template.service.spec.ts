import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuditTemplateService } from './audit-template.service';

describe('AuditTemplateService', () => {
  let service: AuditTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuditTemplateService]
    });
    service = TestBed.inject(AuditTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
