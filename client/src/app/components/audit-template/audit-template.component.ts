import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {AuditTemplateService} from '../../services/audit-template.service';


@Component({
  selector: 'app-audit-template',
  templateUrl: './audit-template.component.html',
  styleUrls: ['./audit-template.component.scss']
})
export class AuditTemplateComponent implements OnInit {

  // Defining type of our form
  templateForm: FormGroup;
  errorMessage: string;
  body: any;
  templateButtonLabel = 'Create Template';

  // Injecting the authService to be able to send data to the backend through it ,
  // fb for the formbuilder validations and Router to redirect to the desired component when registerd successfully
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private auditTemplateService: AuditTemplateService
  ) { }

  // We initialize the form and set validators to each one in case user forget to specify a field
  ngOnInit(): void {
    this.templateForm = this.fb.group({
      title: ['', Validators.required],
      location: [''],
      plant: [''],
      zones: [''],
      aisles: [''],
      bins: [''],
      partNumber: [''],
      serialNumber: [''],
      description: [''],
    });
  }

  createTemplate(): void {
    this.body = {
      title: this.templateForm.value.title,
      location: this.templateForm.value.location,
      plant: this.templateForm.value.plant,
      zones: this.templateForm.value.zones,
      aisles: this.templateForm.value.aisles,
      bins: this.templateForm.value.bins,
      partNumber: this.templateForm.value.partNumber,
      serialNumber: this.templateForm.value.serialNumber,
      description: this.templateForm.value.description,
    };

    // Check if the user has provided any template filter (form filed that is not the title)
    let isBodyEmpty = true;
    Object.entries(this.body).forEach(([key, value]) => {
        if ((key !== 'title') && (value !== '')) {
          isBodyEmpty = false;
        }
      }
    );

    if (isBodyEmpty) {
      this.errorMessage = 'Please specify at least one filter for the template';
    }

    this.auditTemplateService.createTemplate(this.body).subscribe(
      () => {
        this.templateForm.reset(); // Reset form once create-member
        setTimeout(() => {
          // Redirect user to component in path:home (defined in alta-home-routing.module.ts)
          // this.router.navigate(['modify-members']);
        }, 1000); // Waiting 1 second before redirecting the user
        this.resetForm();

      },
      (err) => {
        // if backend returns an error
        if (err.error) {
          this.errorMessage = err.error;
        }
      }
    );

  }

  resetForm(): void {
    this.templateForm.reset();
    Object.keys(this.templateForm.controls).forEach(key => {
      this.templateForm.controls[key].setErrors(null);
    });
  }

}
