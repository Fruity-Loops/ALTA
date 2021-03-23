import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrganizationSettingsService} from "../../services/organization-settings.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-organization-settings',
  templateUrl: './organization-settings.component.html',
  styleUrls: ['./organization-settings.component.scss']
})

@Injectable({
  providedIn: 'root'
})
export class OrganizationSettingsComponent implements OnInit {
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
      interval: ['', Validators.required],
      ftpLocation: ['', Validators.required],
      inv_extract_file: ['', Validators.required],
      organization_id: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.orgSettingsForm = this.fb.group({
      time: [''],
      interval: [''],
      ftpLocation: [''],
      inv_extract_file: [''],
      organization_id: [localStorage.getItem('organization_id')]
    });
  }

  submitForm(): void {
    this.organizationSettings.updateOrganizationSettings(this.orgSettingsForm.value).subscribe(
      (err: string) => {
        this.errorMessage = err;
      }
    );
  }

  getFileName(): string {
    if (this.file){
      return this.file.name;
    } else {
      return 'Select (.csv) File';
    }
  }

  selectFile(event: any) {
    if (event.target.files.length > 0){
      this.file = event.target.files[0];
    }
  }

  openSnackBar(message: string, action: string){
    this._snackBar.open(message, action, {
      duration: 2000,
    })
  }

}
