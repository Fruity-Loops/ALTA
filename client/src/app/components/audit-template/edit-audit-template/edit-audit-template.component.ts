import { Component, OnInit } from '@angular/core';
import { AuditTemplateService } from '../../../services/audit-template.service';
import { ActivatedRoute } from '@angular/router';
import { Template } from '../Template';


@Component({
  selector: 'app-edit-audit-template',
  templateUrl: '../create-audit-template/create-audit-template.component.html',
  styleUrls: ['../create-audit-template/create-audit-template.component.scss']
})
export class EditAuditTemplateComponent implements OnInit {

  errorMessage: string;
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
  //TODO
  // @ts-ignore
  templateValues: Template;
  id: any;
  disabled: boolean;

  constructor(
    //TODO: remove as router is never used
    // private router: Router,

    private auditTemplateService: AuditTemplateService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.errorMessage = ''
    this.disabled = false;
  }

  ngOnInit(): void {
    this.disabled = false;
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

  formTemplate(temp: object): any {
    const createdTemplate: any = {};
    Object.entries(temp).forEach(([key, value]) => {
      if (typeof value === 'string'
        // checks to make sure that it is only adding keys from the template interface
        && this.templateValues.hasOwnProperty(key)) {
        createdTemplate[key] = JSON.parse(value.replace(/'/g, '"')); // replace to fix crash on single quote
      }
    });
    return createdTemplate;
  }

  //TODO: this is bug prone code
  // if true passed to method, although the if statements
  // evaluates to true, template will be assigned a boolean
  // the assigning of body to this.template doesnt guarantee
  // body is of type Template
  // line 57 and 132 the inconsistency of the method
  // @ts-ignore
  initializeForm(body): void {
    if (body) {
      this.disabled = true;
      this.template = body;
    } else {
      this.disabled = false;
    }
  }

  beginEdit(): void {
    this.disabled = false;
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
            window.location.reload();
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
