import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuditTemplateService } from './audit-template.service';
import {ManageAuditsService} from './manage-audits.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('AuditTemplateService', () => {
  let service: AuditTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuditTemplateService, ManageAuditsService]
    });
    service = TestBed.inject(AuditTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
