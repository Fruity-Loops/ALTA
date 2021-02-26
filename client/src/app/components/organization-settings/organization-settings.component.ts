import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrganizationSettingsService} from "../../services/organization-settings.service";
import {VERSION} from "@angular/material";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-organization-settings',
  templateUrl: './organization-settings.component.html',
  styleUrls: ['./organization-settings.component.scss']
})

@Injectable()
export class OrganizationSettingsComponent implements OnInit {
  version = VERSION;
  orgSettingsForm: FormGroup;
  body: any;
  data: any;
  file: any;

  errorMessage = '';
  constructor(
    private organizationSettings: OrganizationSettingsService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
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


    this.organizationSettings.updateOrganizationSettings(formData).subscribe(
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
      this.file = event.target.files[0];
      this.orgSettingsForm.get('inv_extract_file')?.setValue(this.file);
    }
  }

  openSnackBar(message: string, action: string){
    this._snackBar.open(message, action, {
      duration: 2000,
    })
  }

}
