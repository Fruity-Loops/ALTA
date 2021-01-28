import { Component, OnInit } from '@angular/core';
import { AuditService } from 'src/app/services/audit.service';

@Component({
  selector: 'app-bins',
  templateUrl: './bins.page.html',
  styleUrls: ['./bins.page.scss'],
})
export class BinsPage implements OnInit {

  constructor(
    private auditService: AuditService,
    ) { }

  ngOnInit() {
  }

}
