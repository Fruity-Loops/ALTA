import { Component, OnInit } from '@angular/core';
import {AuditTemplateService} from '../../services/audit-template.service';
import {AuthService} from '../../services/auth.service';

interface template {
  author: string,
  calendar_date: string,
  title: string
}

@Component({
  selector: 'app-audit-template',
  templateUrl: './audit-template.component.html',
  styleUrls: ['./audit-template.component.scss']
})
export class AuditTemplateComponent implements OnInit {
  auditTemplates: [template];
  errorMessage = '';

  constructor(private auditTemplateService: AuditTemplateService,
              private authService: AuthService,
  ) { }

  ngOnInit(): void {
      this.getAuditTemplates();
  }


  getAuditTemplates(): void {
    this.auditTemplateService.getAuditTemplates().subscribe(
      (data) => {
        this.auditTemplates = data;
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }



}
