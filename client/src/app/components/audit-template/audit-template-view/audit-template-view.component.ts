import {Component, OnInit} from '@angular/core';
import {Template} from '../Template';


@Component({
  template: ''
})
export abstract class AuditTemplateViewComponent implements OnInit {

  errorMessage: string | undefined;

  template: Template = {
    location: [],
    plant: [],
    zones: [],
    aisles: [],
    bins: [],
    part_number: [],
    serial_number: [],
  };
  templateValues: Template | undefined;
  title = '';
  description = '';


  protected constructor() { }

  ngOnInit(): void {
    this.initializeForm();
  }

  abstract initializeForm(): void;

  addItem(term: string | number, value: string): void {
    console.log("hello");
    console.log(term);
    console.log(value);

    // although not obvious, the includes statement here is also necessary for the proper functionality of the remove function
    // @ts-ignore
    if (value !== '' && !this.template[term].includes(value)) {
      // @ts-ignore
      this.template[term].push(value);
      // @ts-ignore
      this.templateValues[term] = '';
    }
  }

  remove(term: string | number, value: any): void {
    // @ts-ignore
    const index = this.template[term].indexOf(value);

    if (index >= 0) {
      // @ts-ignore
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

  abstract submitQuery(body: any): void;

}
