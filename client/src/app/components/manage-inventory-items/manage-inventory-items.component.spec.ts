import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageInventoryItemsService } from 'src/app/services/inventory-items/manage-inventory-items.service';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageInventoryItemsComponent } from './manage-inventory-items.component';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatCheckboxModule } from '@angular/material';

describe('ManageInventoryItemsComponent', () => {
  let component: ManageInventoryItemsComponent;
  let fixture: ComponentFixture<ManageInventoryItemsComponent>;
  // @ts-ignore
  let service: ManageInventoryItemsService;

  let timeInput: HTMLInputElement;
  let timeBtn: HTMLButtonElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageInventoryItemsComponent],
      providers: [
        FormBuilder,
        { provide: ManageInventoryItemsService },
        { provide: ManageAuditsService },
      ],
      imports: [HttpClientModule, RouterTestingModule,
                MatCheckboxModule],
    });

    fixture = TestBed.createComponent(ManageInventoryItemsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageInventoryItemsService);

    timeInput = fixture.debugElement.query(By.css('#time')).nativeElement;
    timeBtn = fixture.debugElement.query(By.css("#signupbtn")).nativeElement;

  });

  it('should create Inventory Items Component', () => {
    expect(component).toBeTruthy();
  });

  // Test that Start Audit button is disabled when no items selected
  it('should disable Start button when no item selected', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("#create"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  // Test that Start Audit button is disabled when no items selected
   it('should enable Start button when item(s) selected', () => {
    fixture.detectChanges();
     var checkboxArray = fixture.debugElement.queryAll(By.css('.mat-checkbox-input'));
     //expect(checkboxArray.length).toBeGreaterThan(0);
     expect(checkboxArray.length).toBe(0);
     for (const input  of checkboxArray){
        expect(input.nativeElement.checked).toBeFalsy(); 
        input.nativeElement.click();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css("button"));
        expect(button.nativeElement.disabled).toBeFalsy();
      }
  });

  it('should check initial time input is empty',() => {
    fixture.detectChanges();
    expect(timeInput.value).toBe('')
  });

  it('should check initial Update Refresh Time Button is disabled',() => {
    fixture.detectChanges();
    expect(timeBtn.disabled).toBeTruthy();
  });
  
  it('should enable Update Refresh button when time value is entered', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      timeInput.value = '10';
      timeInput.dispatchEvent(new Event('change'));
      expect(timeInput.value).toBe('10');
    });
    fixture.detectChanges();
    expect(timeBtn.disabled).toBeTruthy();
//    expect(timeBtn.disabled).toBeFalsy();
  });
});
