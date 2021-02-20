import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrganizationSettingsService} from "../../services/organization-settings.service";

@Component({
  selector: 'app-organization-settings',
  templateUrl: './organization-settings.component.html',
  styleUrls: ['./organization-settings.component.scss']
})
export class OrganizationSettingsComponent implements OnInit {
  timeForm: FormGroup;
  body: any;
  data: any;

  errorMessage = '';
  constructor(
    private organizationSettings: OrganizationSettingsService,

    private fb: FormBuilder
  ) {

    this.timeForm = this.fb.group({
      time: ['', Validators.required],
    });


  }

  ngOnInit(): void {
  }

  refreshTime(): void {
    this.body = {
      new_job_timing: this.timeForm.value.time,
      organization: localStorage.getItem('organization_id'),
    };

    this.organizationSettings.updateRefreshItemsTime(this.body).subscribe(
      (data: any) => {
        this.timeForm.reset();
      },
      (err: string) => {
        this.errorMessage = err;
      }
    );
  }

}
