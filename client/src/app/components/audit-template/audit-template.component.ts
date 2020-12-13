import { Component, OnInit } from '@angular/core';
import {AuditTemplateService} from '../../services/audit-template.service';
import {AuthService} from '../../services/auth.service';
import {AuditTemplate} from '../../models/audit-template';

@Component({
  selector: 'app-audit-template',
  templateUrl: './audit-template.component.html',
  styleUrls: ['./audit-template.component.scss']
})
export class AuditTemplateComponent implements OnInit {
  auditTemplates: Array<AuditTemplate> = [];
  errorMessage = '';

  // data: Array<AuditTemplate> = [{
  //   title: 'test1',
  //   location: 'location1',
  //   plant: 'plant1',
  //   zones: ['zone1', 'zone2'],
  //   aisles: [1, 2],
  //   bins: [1],
  //   part_number: '434453',
  //   serial_number: 'dsfds',
  //   description: 'big shit'
  // }
  // ];

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
