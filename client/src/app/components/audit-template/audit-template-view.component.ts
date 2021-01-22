import {Router} from '@angular/router';
import {AuditTemplateService} from '../../services/audit-template.service';
import {OnInit} from '@angular/core';

export abstract class AuditTemplateViewComponent implements OnInit {

  protected constructor(
    router: Router,
    auditTemplateService: AuditTemplateService,
  ) {  }

  ngOnInit(): void {
    this.initializeForm();
  }

  abstract initializeForm(): void;

}
