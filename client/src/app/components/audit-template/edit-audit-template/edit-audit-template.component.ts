import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuditTemplateService } from '../../../services/audit-template.service';
import { ActivatedRoute } from '@angular/router';

interface Template {
  location: any;
  plant: any;
  zones: any;
  aisles: any;
  bins: any;
  part_number: any;
  serial_number: any;
}

@Component({
  selector: 'app-edit-audit-template',
  templateUrl: '../create-audit-template/create-audit-template.component.html',
  styleUrls: ['../create-audit-template/create-audit-template.component.scss']
})
export class EditAuditTemplateComponent implements OnInit {

  errorMessage: string;
  templateButtonLabel = 'SAVE';
  todaysDate = new Date();

  title = '';
  description = '';
  template: Template = {
    location: [],
    plant: [],
    zones: [],
    aisles: [],
    bins: [],
    part_number: [],
    serial_number: [],
  };
  templateValues: Template;
  id: any;
  disable: boolean;

  constructor(
    private router: Router,
    private auditTemplateService: AuditTemplateService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.templateValues = {
      location: '',
      plant: '',
      zones: '',
      aisles: '',
      bins: '',
      part_number: '',
      serial_number: '',
    };
    this.activatedRoute.params.subscribe((routeParams) => {
      this.id = routeParams.ID;
      this.auditTemplateService.getATemplate(this.id).subscribe((temp) => {
        this.initializeForm(this.formTemplate(temp));
        this.title = temp.title;
        this.description = temp.description;
        this.id = temp.template_id;
      });
    });
  }

  formTemplate(temp): any {
    let createdTemplate: any = {};
    Object.entries(temp).forEach(([key, value]) => {
      if (typeof key === 'string' && typeof value === 'string'
        // checks to make sure that it is only adding keys from the template interface
        && this.templateValues.hasOwnProperty(key)) {
        createdTemplate[key] = JSON.parse(value.replace(/'/g, '"')); // replace to fix crash on single quote
      }
    });
    return createdTemplate;
  }

  initializeForm(body): void {
    if (body) {
      this.disable = true;
      this.template = body;
    } else {
      this.disable = false;
    }
  }

  addItem(term, value): void {
    // although not obvious, the includes statement here is also necessary for the proper functionality of the remove function
    if (value !== '' && !this.template[term].includes(value)) {
      this.template[term].push(value);
      this.templateValues[term] = '';
    }
  }

  remove(term, value): void {
    const index = this.template[term].indexOf(value);

    if (index >= 0) {
      this.template[term].splice(index, 1);
    }
  }

  submit(): void {
    const body = {
      template_id: this.id,
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
      this.auditTemplateService.updateTemplate(this.id, body).subscribe(
        () => {
          setTimeout(() => {
            // Redirect user back to list of templates
            this.router.navigate(['template']);
          }, 1000); // Waiting 1 second before redirecting the user
          this.initializeForm(false);
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
