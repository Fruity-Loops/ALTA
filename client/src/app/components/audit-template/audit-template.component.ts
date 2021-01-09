import {Component, Inject, OnInit, Optional} from '@angular/core';
import {AuditTemplateService} from '../../services/audit-template.service';
import {AuthService} from '../../services/auth.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

interface Template {
  author: string;
  calendar_date: string;
  title: string;
}

@Component({
  selector: 'app-audit-template',
  templateUrl: './audit-template.component.html',
  styleUrls: ['./audit-template.component.scss']
})
export class AuditTemplateComponent implements OnInit {
  auditTemplates: [Template];
  errorMessage = '';
  dialogRef: any;

  constructor(private auditTemplateService: AuditTemplateService,
              public dialog: MatDialog
  ) { }

  ngOnInit(): void {
      this.getAuditTemplates();
  }


  getAuditTemplates(): void {
    this.auditTemplateService.getAuditTemplates().subscribe(
      (data) => {
        this.auditTemplates = data;
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  openDialog(template_id: string, title: string): void {
    this.dialogRef = this.dialog.open(DeleteTemplateDialogComponent, {data: {id: template_id, title: title}});
    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }
}

interface DialogData {
  title: string
  id: string
}

@Component({
  selector: 'app-organization-dialog',
  templateUrl: 'delete-template-dialog.html',
})
export class DeleteTemplateDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteTemplateDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  closeDialog() {
    this.dialogRef.close(false);
  }

  deleteTemplate() {
    this.dialogRef.close(this.data);
  }

}
