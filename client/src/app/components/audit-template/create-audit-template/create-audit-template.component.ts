import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuditTemplateService} from '../../../services/audit-template.service';
import { Template } from '../Template';
import {AuditTemplateViewComponent} from '../audit-template-view.component';


@Component({
  selector: 'app-create-audit-template',
  templateUrl: './create-audit-template.component.html',
  styleUrls: ['./create-audit-template.component.scss']
})
export class CreateAuditTemplateComponent extends AuditTemplateViewComponent {

  disabled = false;

  constructor(
    private router: Router,
    private auditTemplateService: AuditTemplateService,
  ) {
    super(router, auditTemplateService);
  }

  initializeForm(): void {
    this.templateValues = {
      location: '',
      plant: '',
      zones: '',
      aisles: '',
      bins: '',
      part_number: '',
      serial_number: '',
    };
  }

  submitQuery(body) {
    this.auditTemplateService.createTemplate(body).subscribe(
      () => {
        setTimeout(() => {
          // Redirect user back to list of templates
          this.router.navigate(['template']);
        }, 1000); // Waiting 1 second before redirecting the user
        this.initializeForm();
        this.errorMessage = '';

      },
      (err) => {
        // if backend returns an error
        if (err.error) {
          this.errorMessage = err.error;
        }
      }
    );
  }
}
