import { Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrganizationSettingsService} from "../../services/organization-settings.service";
import {VERSION} from "@angular/material";

@Component({
  selector: 'app-organization-settings',
  templateUrl: './organization-settings.component.html',
  styleUrls: ['./organization-settings.component.scss']
})
export class OrganizationSettingsComponent implements OnInit {
  version = VERSION;
  orgSettingsForm: FormGroup;
  body: any;
  data: any;
  file: any;

  errorMessage = '';
  constructor(
    private organizationSettings: OrganizationSettingsService,
    private fb: FormBuilder
  ) {

    this.orgSettingsForm = this.fb.group({
      time: ['', Validators.required],
      ftpLocation: ['', Validators.required],
      inv_extract_file: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.orgSettingsForm = this.fb.group({
      time: [''],
      interval: [''],
      ftpLocation: [''],
      inv_extract_file: ['']
    });
  }

  refreshTime(): void {
    const formData = new FormData();
    formData.append('file', this.orgSettingsForm.get('inv_extract_file')?.value);
    formData.append('new_job_timing', this.orgSettingsForm.value.time);
    formData.append('new_job_interval', this.orgSettingsForm.value.interval);
    formData.append('ftp_location', this.orgSettingsForm.value.ftpLocation);
    formData.append('organization_id', localStorage.getItem('organization_id') || '');


    // this.body = {
    //   file: this.orgSettingsForm.getRawValue().inv_extract_file,
    //   new_job_timing: this.orgSettingsForm.value.time,
    //   new_job_interval: this.orgSettingsForm.value.interval,
    //   ftp_location: this.orgSettingsForm.value.ftpLocation,
    //   organization_id: localStorage.getItem('organization_id'),

      // new_job_timing: this.orgSettingsForm.value.time,
      // organization: localStorage.getItem('organization_id'),
    // };

    // console.log(this.body.file)

    this.organizationSettings.updateRefreshItemsTime(formData).subscribe(
      (data: any) => {
        this.orgSettingsForm.reset();
      },
      (err: string) => {
        this.errorMessage = err;
      }
    );
  }

  getFileName(): string {
    if(this.file){
      return this.file.name;
    } else {
      return "Choose Spreadsheet File (.xlsx)"
    }
  }

  selectFile(event: any) {
    if (event.target.files.length > 0){
      const file = event.target.files[0];
      this.orgSettingsForm.get('inv_extract_file')?.setValue(file);
    }
  }

}
