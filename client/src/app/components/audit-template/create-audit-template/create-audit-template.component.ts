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

  errorMessage: string;
  disabled = false;

  title = '';
  description = '';

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

  submit(): void {
    const body = {
      title: this.title,
      location: this.template.location,
      plant: this.template.plant,
      zones: this.template.zones,
      aisles: this.template.aisles,
      bins: this.template.bins,
      part_number: this.template.part_number,
      serial_number: this.template.serial_number,
      description: this.description,
    };

    if (this.title !== '') {
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
    } else {
      this.errorMessage = 'Please give a title to your template.';
    }

  }
}
