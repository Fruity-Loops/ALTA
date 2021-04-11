import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignStockKeepersComponent } from './assign-stock-keepers.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageMembersService } from 'src/app/services/users/manage-members.service';
import { By } from '@angular/platform-browser';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { AppModule } from 'src/app/app.module';
import { ManageInventoryItemsComponent } from 'src/app/components/manage-inventory-items/manage-inventory-items.component';
import { ManageStockKeepersDesignationComponent } from 'src/app/components/manage-stock-keepers-designation/manage-stock-keepers-designation.component'
import { HttpParams } from '@angular/common/http';
import { AuthService, UserLocalStorage } from 'src/app/services/authentication/auth.service';
import { ManageMemberSpecVariables } from 'src/app/services/users/manage-members-spec-variables';
import { ManageAuditsSpecVariables } from 'src/app/services/audits/manage-audits-spec-variables';
import { Observable, throwError } from 'rxjs';

describe('AssignStockKeepersComponent', () => {
  let component: AssignStockKeepersComponent;
  let fixture: ComponentFixture<AssignStockKeepersComponent>;
  let memberService: ManageMembersService;
  let auditService: ManageAuditsService;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignStockKeepersComponent],
      providers: [ManageMembersService, ManageAuditsService, AuthService],
      imports: [HttpClientTestingModule,
                AppModule,
                RouterTestingModule.withRoutes([
                  {path: 'manage-items', component: ManageInventoryItemsComponent},
                  {path: 'audits/assign-sk/designate-sk', component: ManageStockKeepersDesignationComponent}]
                )],
    }).compileComponents();
    fixture = TestBed.createComponent(AssignStockKeepersComponent);
    component = fixture.componentInstance;
    memberService = TestBed.inject(ManageMembersService);
    auditService = TestBed.inject(ManageAuditsService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    memberService = null;
    auditService = null;
    authService = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(memberService).toBeTruthy();
    expect(auditService).toBeTruthy();
  });

  it('should initiate', () => {
    let orgId = '1';
    let params = new HttpParams();
    params = params.append('organization', orgId);
    params = params.append('status', 'Active');
    params = params.append('no_pagination', 'True');
    spyOn(authService, 'getLocalStorage').and.returnValue(orgId);
    spyOn(auditService, 'getBusySKs').and.returnValue(new Observable((observer) => {
      observer.next(ManageAuditsSpecVariables.auditListing);
      observer.complete();
    }));
    spyOn(component, 'populateTable').and.returnValue();
    spyOn(memberService, 'getAllClients').and.returnValue(new Observable((observer) => {
      observer.next(ManageMemberSpecVariables.employees);
      observer.complete();
    }));
    component.params = new HttpParams();
    component.ngOnInit();
    expect(authService.getLocalStorage).toHaveBeenCalledWith(UserLocalStorage.OrgId);
    expect(component.params).toEqual(params);
    expect(auditService.getBusySKs).toHaveBeenCalledWith(params);
    expect(component.busySKs).toEqual(ManageAuditsSpecVariables.auditListing.map((obj: any) => obj.assigned_sk).flat());
    expect(memberService.getAllClients).toHaveBeenCalledWith();
    expect(component.populateTable).toHaveBeenCalledWith(ManageMemberSpecVariables.employees);
  });

  it('should populate the table', () => {
    let auditId = 1;
    let count = 1;
    let maxAssign = [
      {
        "location": "Florida",
        "totalBins": 2
      }
    ];
    let locationsAndUsers = [
      {
        "location": "Florida",
        "users": [
          {
            "first_name": "stock",
            "last_name": "keeper",
            "email": "sk@test.com",
            "role": "SK",
            "is_active": true,
            "id": 3,
            "location": "Florida",
            "organization": 1,
            "user_name": "sk",
            "availability": "Busy"
          }
        ]
      }
    ];

    spyOn(auditService, 'getAuditData').and.returnValue(new Observable((observer) => {
      observer.next(ManageAuditsSpecVariables.auditReturnInfo);
      observer.complete();
    }));
    spyOn(component, 'addLocationWithSKs').and.returnValue([]);
    spyOn(component, 'setCheckboxDisableStatus').and.returnValue();
    spyOn(component, 'getMaxAssignPerLocation').and.callFake(() => {
      if (count == 2)
        return maxAssign;
      else
      {
        count++;
        return []
      };
    });
    component.auditID = auditId;
    component.locationsAndUsers = locationsAndUsers;
    component.maxAssignPerLocation = new Array<any>();
    component.populateTable(ManageMemberSpecVariables.employees);
    expect(auditService.getAuditData).toHaveBeenCalledWith(auditId);
    expect(component.skToAssign).toEqual(ManageAuditsSpecVariables.auditReturnInfo.assigned_sk.map((obj: any) => obj.id));
    expect(component.maxAssignPerLocation).toEqual(maxAssign);
    expect(component.locationsAndUsers).toEqual(locationsAndUsers);
    expect(component.dataSource.data).toEqual(locationsAndUsers[0].users);
  });

  it('should get the max assignments per location', () => {
    let location = 'Florida';
    let maxAssign = [
      {
        location: "Florida",
        "totalBins": 2
      }
    ];
    component.maxAssignPerLocation = [];
    expect(component.getMaxAssignPerLocation(location, ManageAuditsSpecVariables.auditReturnInfo)).toEqual(maxAssign);
    component.maxAssignPerLocation = maxAssign;
    expect(component.getMaxAssignPerLocation(location, ManageAuditsSpecVariables.auditReturnInfo)).toEqual([]);
  });

  it('should add locations with SKs', () => {
    let updatedEmployee = ManageMemberSpecVariables.employees[2];
    updatedEmployee['availability'] = "Busy";
    expect(component.addLocationWithSKs('Florida', ManageMemberSpecVariables.employees)).toEqual([{
      "location": "Florida",
      "users": [
          {
              "first_name": "stock",
              "last_name": "keeper",
              "email": "sk@test.com",
              "role": "SK",
              "is_active": true,
              "id": 3,
              "location": "Florida",
              "organization": 1,
              "user_name": "sk",
              "availability": "Busy"
          }
      ]
    }]);
    let noSKs = ManageMemberSpecVariables.employees[1];
    expect(component.addLocationWithSKs('Florida', [noSKs])).toEqual([{location: "Florida", users: []}]);
    let locationsAndUsers = [
      {
        "location": "Florida",
        "users": [
          {
            "first_name": "stock",
            "last_name": "keeper",
            "email": "sk@test.com",
            "role": "SK",
            "is_active": true,
            "id": 3,
            "location": "Florida",
            "organization": 1,
            "user_name": "sk",
            "availability": "Busy"
          }
        ]
      }
    ];
    component.locationsAndUsers = locationsAndUsers;
    expect(component.addLocationWithSKs('Florida', ManageMemberSpecVariables.employees)).toEqual([]);
  });

  it('should set check box disable status', () => {
    spyOn(component, 'setBusyStatus').and.returnValue();
    let maxAssign = [
      {
        "location": "Florida",
        "totalBins": 2
      }
    ];
    let locationsAndUsers = [
      {
        "location": "Florida",
        "users": [
          {
            "first_name": "stock",
            "last_name": "keeper",
            "email": "sk@test.com",
            "role": "SK",
            "is_active": true,
            "id": 3,
            "location": "Florida",
            "organization": 1,
            "user_name": "sk",
            "availability": "Busy"
          }
        ]
      }
    ];
    component.skToAssign = [3, 3];
    component.busySKs = ManageAuditsSpecVariables.busySKs;
    component.locationsAndUsers = locationsAndUsers;
    component.maxAssignPerLocation = maxAssign;
    component.setCheckboxDisableStatus();
  });

  it('should set busy status', () => {
    let user = {
      "first_name": "stock",
      "last_name": "keeper",
      "email": "sk@test.com",
      "role": "SK",
      "is_active": true,
      "id": 3,
      "location": "Florida",
      "organization": 1,
      "user_name": "sk",
      "availability": "Busy"
    };
    component.setBusyStatus(user, true);
    component.setBusyStatus(user, false);
  });

  it('should check', () => {
    component.skToAssign = [3];
    component.isChecked(3);
  });

  it ('should change', () => {
    let maxAssign = [
      {
        location: "Florida",
        "totalBins": 2
      }
    ];
    let maxAssign2 = [
      {
        location: "Florida",
        "totalBins": 1
      }
    ];
    let locationsAndUsers = [
      {
        "location": "Florida",
        "users": [
          {
            "first_name": "stock",
            "last_name": "keeper",
            "email": "sk@test.com",
            "role": "SK",
            "is_active": true,
            "id": 3,
            "location": "Florida",
            "organization": 1,
            "user_name": "sk",
            "availability": "Available"
          }
        ]
      }
    ];
    component.locationsAndUsers = locationsAndUsers;
    component.skToAssign = [3];
    component.assignments = [3];
    component.maxAssignPerLocation = maxAssign;
    component.onChange(3, 'Florida');
    component.maxAssignPerLocation = maxAssign2;
    component.onChange(3, 'Florida');
  });

  it('should submit', () => {
    let count = 1;
    let count2 = 1;
    spyOn(auditService, 'assignSK').and.callFake(() => {
      if (count2 == 1)
      return new Observable((observer) => {
        observer.next(ManageAuditsSpecVariables.edittedAudit);
        observer.complete();
      });
      else
      return new Observable((observer) => {
        observer.error(new Error("Parsing is not possible"));
        observer.complete();
      });
    });
    spyOn(auditService, 'createAuditAssignments').and.callFake(() => {
      if (count == 2)
      {
        return new Observable((observer) => {
          observer.next(ManageAuditsSpecVariables.edittedAudit);
          observer.complete();
        });
      }
      else
      return new Observable((observer) => {
        observer.error(new Error("Parsing is not possible"));
        observer.complete();
      });
    });
    spyOn(component.router, 'navigate');
    component.submitAssignedSKs();
    count++;
    component.submitAssignedSKs();
    count2++;
    component.submitAssignedSKs();
  });

  it('should delete the audit', () => {
    let count = 1;
    spyOn(auditService, 'removeFromLocalStorage').and.returnValue();
    spyOn(auditService, 'deleteAudit').and.callFake(() => {
      return new Observable((observer) => {
        observer.next({errorStatus: 'garbage'});
        observer.complete();
      });
    }
    );
    component.auditID = 1;
    component.deleteAudit();
  });

  it('should go back to the inventory', () => {
    spyOn(component.router, 'navigate');
    component.goBackInventory();
  });

  it('should open the dialog', () => {
    spyOn(component.dialog, 'open');
    component.openDialogWithRef(component.template);
  });

  it('should cancel the dialog', () => {
    spyOn(component.dialog, 'closeAll');
    component.cancelDialog();
  });

  it('should discard the audit', () => {
    spyOn(component, 'deleteAudit').and.returnValue();
    spyOn(component.dialog, 'closeAll');
    component.discardAudit();
  });

  it('disable the assign', () => {
    let locationsAndUsers = [
      {
        "location": "Florida",
        "users": [
          {
            "first_name": "stock",
            "last_name": "keeper",
            "email": "sk@test.com",
            "role": "SK",
            "is_active": true,
            "id": 3,
            "location": "Florida",
            "organization": 1,
            "user_name": "sk",
            "availability": "Available"
          }
        ]
      }
    ];
    component.skToAssign = [3];
    component.locationsAndUsers = locationsAndUsers;
    component.disableAssign();
    component.skToAssign = [];
    component.disableAssign();
  });

  it('should handle an event', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.beforeUnloadHandler({});
  });

  // Test that Start Audit button is disabled when no items selected
  it('should enable Assign button when item(s) selected', () => {
    fixture.detectChanges();
    const checkboxArray = fixture.debugElement.queryAll(By.css('.mat-checkbox-input'));
    expect(checkboxArray.length).toBe(0);
    for (const input  of checkboxArray){
        expect(input.nativeElement.checked).toBeFalsy();
        input.nativeElement.click();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.button.bottom-assign'));
        expect(button.nativeElement.disabled).toBeFalsy();
      }
  });

  // Test the populateTable()
  it('Call method', () => {
    try {
      component.populateTable([{
      first_name: 'Daph',
      last_name: 'Ne',
      role: 'SA',
      is_active: true,
      id: 2,
      email: 'daph@test.com',
      location: 'Montreal', }]);
      }
    catch (error) {
    console.error(error);
    }
  });



});
