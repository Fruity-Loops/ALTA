import { BaseOrganizationSettingsForm, OrganizationSettingsView } from '../organization-settings-view';
import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { OrganizationSettingsService } from 'src/app/services/organization-settings.service';


@Component({
  selector: 'app-organization-settings',
  templateUrl: '../organization-settings.component.html',
  styleUrls: ['../organization-settings.component.scss']
})

@Injectable({
  providedIn: 'root'
})

export class EditOrganizationSettingsComponent extends OrganizationSettingsView {

  edit = false;
  file: any;
  id: string | undefined;
  currentFile: string;


  orgSettingsForm: FormGroup | undefined;

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver = false;

  errorMessage = '';
  constructor(
    private organizationSettings: OrganizationSettingsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    super();
    this.id = localStorage.getItem('organization_id')?.toString();
    this.getOrganization();
    this.currentFile = 'none';
  }

  getIsEdit(): boolean {
    return true;
  }

  getOrganization(): void {
    this.organizationSettings.getOrganization(this.id!).subscribe((organization: any) => {
      console.log(organization);

      this.orgSettingsForm = this.fb.group({
        ftpLocation: new FormControl({ value: organization.ftp_location, disabled: !this.edit }, [Validators.required]),
        time: new FormControl({ value: organization.inventory_items_refresh_job, disabled: !this.edit }, [Validators.required]),
        interval: new FormControl({ value: organization.repeat_interval, disabled: !this.edit }, [Validators.required]),
        organization_id: [localStorage.getItem('organization_id')]
      });
      const fileArr = organization.file.split('/');
      this.currentFile = fileArr[fileArr.length - 1];
      this.isLoaded();
    });
  }

  editMode(turnOn: boolean): void {
    this.edit = turnOn;
    // @ts-ignore
    Object.keys(this.orgSettingsForm.controls).forEach(key => {
      this.orgSettingsForm?.controls[key].enable();
    });
    if (!turnOn) {
      this.submitForm();
      this.upload();
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

  submitQuery(base: BaseOrganizationSettingsForm): void {
    this.upload();
    this.organizationSettings.updateOrganizationSettings(this.orgSettingsForm?.value).subscribe(
      (err: string) => {
        this.errorMessage = err;
      }
    );
    location.reload();
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  fileOverBase(event: any): void {
    this.hasBaseDropZoneOver = event;
  }

  getFile(): FileLikeObject | null {
    if (this.uploader.queue.length > 0) {
      return this.uploader.queue[this.uploader.queue.length - 1].file;
    }
    else {
      return null;
    }
  }

  upload(): void {
    const file = this.getFile();
    if (file) {
      const formData: FormData = new FormData();
      // @ts-ignore
      formData.append('organization_id', this.id);
      formData.append('file', file.rawFile, file.name);

      this.organizationSettings.uploadInventoryFile(formData).subscribe(
        (err: string) => {
          this.errorMessage = err;
        }
      );
    }
  }

}

