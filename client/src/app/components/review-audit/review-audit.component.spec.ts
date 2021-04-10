import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewAuditComponent } from './review-audit.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { AuditLocalStorage, ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AppModule } from 'src/app/app.module';
import { ManageAuditsComponent } from 'src/app/components/manage-audits/manage-audits.component';
import { ManageStockKeepersDesignationComponent } from 'src/app/components/manage-stock-keepers-designation/manage-stock-keepers-designation.component';
import { Observable } from 'rxjs';
import { ReviewAuditSpecVariables } from './review-audit-spec-variables';

describe('AssignStockKeepersComponent', () => {
  let component: ReviewAuditComponent;
  let fixture: ComponentFixture<ReviewAuditComponent>;
  let authService: AuthService;
  let auditService: ManageAuditsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewAuditComponent],
      providers: [
        FormBuilder,
        AuthService,
        ManageAuditsService
      ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        AppModule,
        RouterTestingModule.withRoutes([
            {path: 'audits', component: ManageAuditsComponent},
            {path: 'audits/assign-sk/designate-sk', component: ManageStockKeepersDesignationComponent}
        ]),
      ],
    });

    fixture = TestBed.createComponent(ReviewAuditComponent);
    authService = TestBed.inject(AuthService);
    auditService = TestBed.inject(ManageAuditsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component = null;
    fixture = null;
    authService = null;
    auditService = null;
    httpTestingController.verify();
    httpTestingController = null;
  });

  it('should create Review Audit Component', () => {
    expect(component).toBeTruthy();
    expect(authService).toBeTruthy();
    expect(auditService).toBeTruthy();
  });

  it('should build the table', () => {
    const tableData = [
      {
        "name": "stock keeper",
        "bins": "C69",
        "numberOfParts": 1,
        "initiatedBy": "inventory manager",
        "date": "NaN/NaN/NaN NaN:NaN",
        "location": "Florida"
      },
      {
        "name": "stock keeper",
        "bins": "C20",
        "numberOfParts": 1,
        "initiatedBy": "inventory manager",
        "date": "NaN/NaN/NaN NaN:NaN",
        "location": "Florida"
      }
    ]
    component.binData = ReviewAuditSpecVariables.returnedBins;
    component.currentUser = {first_name: "inventory", last_name: "manager"};
    component.buildTable();
    expect(component.locationsAndUsers).toEqual([{location: 'Florida'}]);
    expect(component.dataSource.data).toEqual(tableData);
  });

  it('should get the table data', () => {
    spyOn(localStorage, 'getItem').and.returnValue('4');
    spyOn(component, 'buildTable').and.callFake(() => {});
    spyOn(authService, 'getCurrentUser').and.returnValue(new Observable((observer) => {
      observer.next(ReviewAuditSpecVariables.customUser);
      observer.complete();
    }));
    spyOn(auditService, 'getAssignedBins').and.returnValue(new Observable((observer) => {
      observer.next(ReviewAuditSpecVariables.returnedBins);
      observer.complete();
    }));

    component.auditID = ReviewAuditSpecVariables.auditId;
    component.getTableData();
    expect(auditService.getAssignedBins).toHaveBeenCalledWith(ReviewAuditSpecVariables.auditId);
    expect(localStorage.getItem).toHaveBeenCalledWith('id');
    expect(authService.getCurrentUser).toHaveBeenCalledWith(localStorage.getItem('id'));
    expect(component.buildTable).toHaveBeenCalledWith();
  });

  it('should initialize properly', () => {
    spyOn(component, 'getTableData').and.callFake(() => {});
    component.ngOnInit();
    expect(component.getTableData).toHaveBeenCalledWith();
  });

  it('should return to select the SKs', () => {
    spyOn(component.router, 'navigate');
    component.goBackDesignateSK();
    expect(component.requestConfirmation).toEqual(false);
    expect(component.router.navigate).toHaveBeenCalledWith(['audits/assign-sk/designate-sk'], { replaceUrl: true });
  });

  it('should delete the Pre Audit Data', () => {
    spyOn(auditService, 'deletePreAudit').and.returnValue(new Observable((observer) => {
      observer.next(null);
      observer.complete();
    }));
    component.binData = ReviewAuditSpecVariables.returnedBins;
    component.deleteBinSKData();
    for (let bin of ReviewAuditSpecVariables.returnedBins)
    {
      expect(auditService.deletePreAudit).toHaveBeenCalledWith(bin.bin_id);
    }
  });

  it('should delete the audit', () => {
    spyOn(auditService, 'removeFromLocalStorage').and.callFake(() => {});
    spyOn(auditService, 'deleteAudit').and.returnValue(new Observable((observer) => {
      observer.next(null);
      observer.complete();
    }));
    component.auditID = ReviewAuditSpecVariables.auditId;
    component.deleteAudit();
    expect(auditService.deleteAudit).toHaveBeenCalledWith(ReviewAuditSpecVariables.auditId);
    expect(auditService.removeFromLocalStorage).toHaveBeenCalledWith(AuditLocalStorage.AuditId)
  });

  it('should confirm the review', async() => {
    spyOn(component.router, 'navigate');
    spyOn(localStorage, 'getItem').and.returnValue('4');
    spyOn(auditService, 'removeFromLocalStorage').and.callFake(() => {});
    spyOn(auditService, 'assignSK').and.returnValue(new Observable((observer) => {
      observer.next(ReviewAuditSpecVariables.assignedSKaudit);
      observer.complete();
    }));

    await fixture.ngZone.run(() => {
      component.confirmReviewAuditData();
      fixture.detectChanges();
    });
    await fixture.whenStable();
    expect(localStorage.getItem).toHaveBeenCalledWith(AuditLocalStorage.AuditId);
    expect(auditService.assignSK).toHaveBeenCalledWith({ status: 'Active' }, Number(localStorage.getItem(AuditLocalStorage.AuditId)));
    expect(auditService.removeFromLocalStorage).toHaveBeenCalledWith(AuditLocalStorage.AuditId);
    expect(component.requestConfirmation).toEqual(false);
    expect(component.router.navigate).toHaveBeenCalledWith(['audits'], { replaceUrl: true });
  });

  it('should open the dialog', () => {
    spyOn(component.dialog, 'open');
    const template = component.template;
    component.openDialogWithRef(template);
    expect(component.dialog.open).toHaveBeenCalledWith(template);
  });

  it('should cancel the dialog', () => {
    spyOn(component.dialog, 'closeAll');
    component.cancelDialog();
    expect(component.dialog.closeAll).toHaveBeenCalledWith();
  });

  it('should discard the audit', () => {
    spyOn(component.dialog, 'closeAll');
    spyOn(component, 'deleteAudit').and.callFake(() => {});
    component.discardAudit();
    expect(component.requestConfirmation).toEqual(false);
    expect(component.deleteAudit).toHaveBeenCalledWith();
    expect(component.dialog.closeAll).toHaveBeenCalledWith();
  });

  it('should discard the audit', () => {
    spyOn(component.dialog, 'closeAll');
    spyOn(component, 'deleteAudit').and.callFake(() => {});
    component.discardAudit();
    expect(component.requestConfirmation).toEqual(false);
    expect(component.deleteAudit).toHaveBeenCalledWith();
    expect(component.dialog.closeAll).toHaveBeenCalledWith();
  });

  it('should request to confirm', () => {
    let returnValue = true;
    spyOn(window, 'confirm').and.returnValue(returnValue);
    expect(component.beforeUnloadHandler({})).toEqual((returnValue));
  });
});
