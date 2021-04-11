import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ManageInventoryItemsService } from 'src/app/services/inventory-items/manage-inventory-items.service';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageInventoryItemsComponent } from './manage-inventory-items.component';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { ManageInventoryItemsSpecVariables } from 'src/app/services/inventory-items/manage-inventory-items-spec-variables';
import { Observable, of, throwError } from 'rxjs';

fdescribe('ManageInventoryItemsComponent', () => {
  let component: ManageInventoryItemsComponent;
  let fixture: ComponentFixture<ManageInventoryItemsComponent>;
  // @ts-ignore
  let manageinventoryService: ManageInventoryItemsService;
  // @ts-ignore
  let manageauditService: ManageAuditsService;
  // @ts-ignore
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageInventoryItemsComponent],
      providers: [
        FormBuilder,
        { provide: ManageInventoryItemsService },
        { provide: ManageAuditsService },
        { provide: AuthService },
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule],
    });

    manageinventoryService = TestBed.inject(ManageInventoryItemsService);
    manageauditService = TestBed.inject(ManageAuditsService);
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(ManageInventoryItemsComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    manageinventoryService = null;
    manageauditService = null;
    authService = null;
    httpTestingController = null;
  });

  it('should create Inventory Items Component', () => {
    expect(component).toBeTruthy();
    expect(manageinventoryService).toBeTruthy();
    expect(manageauditService).toBeTruthy();
    expect(authService).toBeTruthy();
  });

  // Test that Start Audit button is disabled when no items selected
  it('should disable Start button when no item selected', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('#create'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

// Test the initilization of items data
it('should initialize properly', () => {
  spyOn(component, 'getItems').and.callFake(() => {});
  component.ngOnInit();
  expect(component.getItems).toHaveBeenCalledWith();
});

// Test the update page method
  it('test updatePage', () => {
    spyOn(manageinventoryService, 'getPageItems').and.returnValues(of({
      test: 0
    }), throwError('error!'));
    component.updatePage();
    expect(component.data.test).toBe(0);
    component.updatePage();
    expect(component.errorMessage).toBe('error!');
  });

// Test the items data
it('test getItems', () => {
  component.getItems();
  expect(component.errorMessage).toBe('');
});

// Test the submit audit method
it('test submitAudit', () => {
  component.submitAudit();
  expect(component.errorMessage).toBe('');
});

// Test the on row selection method
it('test updatePage', () => {
  component.updatePage();
  expect(component.errorMessage).toBe('');
});
});
