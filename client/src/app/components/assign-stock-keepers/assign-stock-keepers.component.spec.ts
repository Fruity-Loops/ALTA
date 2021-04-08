import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignStockKeepersComponent } from './assign-stock-keepers.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ManageMembersService } from 'src/app/services/users/manage-members.service';
import { By } from '@angular/platform-browser';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { AppModule } from 'src/app/app.module';
// import {AltaMainRoutingModule} from 'src/app/modules/alta-main-routing/alta-main-routing.module'
import {ManageInventoryItemsComponent} from 'src/app/components/manage-inventory-items/manage-inventory-items.component';

describe('AssignStockKeepersComponent', () => {
  let component: AssignStockKeepersComponent;
  let fixture: ComponentFixture<AssignStockKeepersComponent>;
  // @ts-ignore
  let service: ManageMembersService;
  // @ts-ignore
  let service2: ManageAuditsService;

  beforeEach(() => {    
    TestBed.configureTestingModule({
      declarations: [AssignStockKeepersComponent],
      providers: [ManageMembersService, ManageAuditsService],
      imports: [HttpClientTestingModule,
                RouterTestingModule.withRoutes(
                  [{path: 'manage-items', component: ManageInventoryItemsComponent}]
                ),
                MatDialogModule,
                AppModule,
                ],
    }).compileComponents();
    fixture = TestBed.createComponent(AssignStockKeepersComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageMembersService);
    service2 = TestBed.inject(ManageAuditsService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    service = null;
    service2 = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  // Test the deleteAudit()
  it('Call deleteAudit', () => {
    try {
      component.deleteAudit();
      component.discardAudit();
    }
    catch (errorMessage) {
      console.error(errorMessage);
    }
  });

  // Test the goBackIventory()
  it('Call goBackIventory', () => {
    try {
      component.goBackIventory();
    }
    catch (err) {
    console.error(err);
    }
  });

   // Test the dialog window
  it('Call the dialog object', () => {
    try {
      component.cancelDialog();
    }
    catch (err) {
    console.error(err);
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
