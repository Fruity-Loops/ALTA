import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuditTemplateService} from '../../../services/audit-template.service';
import { Template } from '../Template';


@Component({
  selector: 'app-create-audit-template',
  templateUrl: './create-audit-template.component.html',
  styleUrls: ['./create-audit-template.component.scss']
})
export class CreateAuditTemplateComponent implements OnInit {

  errorMessage: string;
  todaysDate = new Date();
  disabled = false;

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
  //TODO
  // @ts-ignore
  templateValues: Template;

  constructor(
    private router: Router,
    private auditTemplateService: AuditTemplateService,
  ) {
    this.errorMessage = ''

  }

  // We initialize the form and set validators to each one in case user forget to specify a field
  ngOnInit(): void {
    this.initializeForm();
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

  addItem(term: keyof Template, value: any): void {
    // although not obvious, the includes statement here is also necessary for the proper functionality of the remove function
    if (value !== '' && !this.template[term].includes(value)) {
      this.template[term].push(value);
      this.templateValues[term] = '';
    }
  }

  remove(term: keyof Template, value: any): void {
    const index = this.template[term].indexOf(value);

    if (index >= 0) {
      this.template[term].splice(index, 1);
    }
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
