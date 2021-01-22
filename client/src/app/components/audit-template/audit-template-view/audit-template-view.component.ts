import {Router} from '@angular/router';
import {AuditTemplateService} from '../../../services/audit-template.service';
import {Component, OnInit} from '@angular/core';
import {Template} from '../Template';


@Component({
  template: ''
})
export abstract class AuditTemplateViewComponent implements OnInit {

  errorMessage: string;

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
  title = '';
  description = '';


  protected constructor() { }

  ngOnInit(): void {
    this.initializeForm();
  }

  abstract initializeForm(): void;

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
      title: this.title,
      description: this.description,
      ...this.template
    };

    if (this.title !== '') {
      this.submitQuery(body);
    } else {
      this.errorMessage = 'Please give a title to your template.';
    }
  }

  abstract submitQuery(body): void;

}
