import {Component, Inject, OnInit, Optional} from '@angular/core';
import {AuditTemplateService} from '../../../services/audits/audit-template.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ManageAuditsService, AuditLocalStorage} from '../../../services/audits/manage-audits.service';
import {AuthService, UserLocalStorage} from '../../../services/authentication/auth.service';
import {ManageInventoryItemsService} from '../../../services/inventory-items/manage-inventory-items.service';
import {HttpParams} from '@angular/common/http';

// import {Template as Temp} from '../Template';

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
  // TODO
  // @ts-ignore
  auditTemplates: [Template];
  errorMessage = '';
  dialogRef: any;
  params = new HttpParams();

  constructor(
    private auditTemplateService: AuditTemplateService,
    public dialog: MatDialog,
    private router: Router,
    private auditService: ManageAuditsService,
    private authService: AuthService,
    private itemService: ManageInventoryItemsService,
  ) {
  }

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

  openDialog(id: string, title: string): void {
    this.dialogRef = this.dialog.open(DeleteTemplateDialogComponent, {data: {id, title}});
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.auditTemplateService.deleteTemplate(result.id).subscribe( () => {
          this.getAuditTemplates();
        });
      }
    });
  }

  startAudit(id: string): void {
    this.auditTemplateService.getATemplate(id).subscribe(
      (data) => {
        this.getItemsForTemplate(data, id);
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }

  getItemsForTemplate(auditTemplate: object, id: string): void {
    this.params = this.params = new HttpParams();
    for (let key in auditTemplate)
    {
      // @ts-ignore
      let value = auditTemplate[key]
      if (value != "[]" && value != "" && value != null)
      {
        if (value.toString().indexOf("[") > -1)
        {
          let arrayFromString = value.replace(/'/g, '"');
          value = JSON.parse(arrayFromString);
        }
        this.params = this.params.set(key, value);
      }
    }
    let badKeys = ['template_id', 'author', 'title', 'start_date', 'calendar_date', 'time_zone_utc'];
    for (let key in badKeys)
    {
      this.params = this.params.delete(badKeys[key]);
    }
    this.itemService.getTemplateItems(this.params).subscribe((data) => {
      if (data.length > 0)
      {
        let items = [];
        for (let item of data)
          items.push(item.Item_Id)
        this.createAudit(items, id);
      }
      else
        alert("Template is Invalid");
    },
    (err) => {
      this.errorMessage = err;
    });
  }

  createAudit(items: object, id: string): void {
    let bodyAudit: object;
    bodyAudit = {
      initiated_by: Number(localStorage.getItem('id')),
      inventory_items: items,
      organization: Number(this.authService.getLocalStorage(UserLocalStorage.OrgId)),
      template_id: id
    };
    this.auditService.createAudit(bodyAudit).subscribe(
      (data) => {
        this.auditService.updateLocalStorage(AuditLocalStorage.AuditId, data.audit_id);
        setTimeout(() => {
          this.router.navigate(['audits/assign-sk']);
        }, 1000);
      },
      (err) => {
        this.errorMessage = err;
      }
    );
  }
}

interface DialogData {
  title: string;
  id: string;
}

@Component({
  selector: 'app-organization-dialog',
  templateUrl: 'delete-template-dialog.html',
})
export class DeleteTemplateDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteTemplateDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  deleteTemplate(): void {
    this.dialogRef.close(this.data);
  }

}
