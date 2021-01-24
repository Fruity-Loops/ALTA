import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuditTemplateService} from '../../../../services/audit-template.service';
import {AuditTemplateViewComponent} from '../audit-template-view.component';


@Component({
  selector: 'app-create-audit-template',
  templateUrl: '../audit-template-view.component.html',
  styleUrls: ['../audit-template-view.component.scss']
})
export class CreateAuditTemplateComponent extends AuditTemplateViewComponent {

  disabled = false;

  constructor(
    private router: Router,
    private auditTemplateService: AuditTemplateService,
  ) {
    super();
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

  submitQuery(body): void {
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
