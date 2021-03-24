import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrganizationSettingsService} from "../../services/organization-settings.service";
import {MatSnackBar} from "@angular/material/snack-bar";

import { FileUploader, FileLikeObject } from 'ng2-file-upload';

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

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver: boolean = false;

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
    this.upload();
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

  fileOverBase(event: any):  void {
    this.hasBaseDropZoneOver  =  event;
  }

  getFile(): FileLikeObject {
    return this.uploader.queue[this.uploader.queue.length-1].file;
  }

  upload(){
    let file = this.getFile();
    const formData: FormData = new FormData();
    formData.append('organization_id', localStorage.getItem('organization_id') || '');
    formData.append('file', file.rawFile, file.name);

    this.organizationSettings.uploadInventoryFile(formData).subscribe(
      (err: string) => {
        this.errorMessage = err;
      }
    );

  }

}
