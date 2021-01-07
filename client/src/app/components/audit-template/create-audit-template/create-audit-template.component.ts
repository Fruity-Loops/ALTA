import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {AuditTemplateService} from '../../../services/audit-template.service';
import { MatDialog } from '@angular/material';
import { template } from '../Template';

@Component({
  selector: 'app-create-audit-template',
  templateUrl: './create-audit-template.component.html',
  styleUrls: ['./create-audit-template.component.scss']
})
export class CreateAuditTemplateComponent implements OnInit {

  templateButtonLabel = 'SAVE';
  todaysDate = new Date();

  title: string = '';
  description: string = '';
  template: template = {
    location: [],
    plant: [],
    zones: [],
    aisles: [],
    bins: [],
    part_number: [],
    serial_number: [],
  }
  templateValues: template

  constructor(
    private router: Router,
    private auditTemplateService: AuditTemplateService,
  ) { }

  // We initialize the form and set validators to each one in case user forget to specify a field
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.templateValues= {
      location: '',
      plant: '',
      zones: '',
      aisles: '',
      bins: '',
      part_number: '',
      serial_number: '',
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
    let index = this.template[term].indexOf(value);

    if (index >= 0) {
      this.template[term].splice(index, 1);
    }
  }

  submit(): void {
    let body = {
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

    this.auditTemplateService.createTemplate(body).subscribe(
      () => {
        setTimeout(() => {
          // Redirect user back to list of templates
          this.router.navigate(['template']);
        }, 1000); // Waiting 1 second before redirecting the user
        this.initializeForm();

      }
    );
  }
}
