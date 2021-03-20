import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignStockKeepersComponent } from './assign-stock-keepers.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ManageMembersService } from 'src/app/services/users/manage-members.service';
import { By } from '@angular/platform-browser';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';

describe('AssignStockKeepersComponent', () => {
  let component: AssignStockKeepersComponent;
  let fixture: ComponentFixture<AssignStockKeepersComponent>;
  // @ts-ignore
  let service: ManageMembersService;
  // @ts-ignore
  let service2: ManageAuditsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignStockKeepersComponent],
      providers: [ManageMembersService, ManageAuditsService],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignStockKeepersComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageMembersService);
    service2 = TestBed.inject(ManageAuditsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test that Start Audit button is disabled when no items selected
  it('should enable Assign button when item(s) selected', () => {
    fixture.detectChanges();
     var checkboxArray = fixture.debugElement.queryAll(By.css('.mat-checkbox-input'));
     expect(checkboxArray.length).toBe(0);
     for (const input  of checkboxArray){
        expect(input.nativeElement.checked).toBeFalsy(); 
        input.nativeElement.click();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.button.bottom-assign'));
        expect(button.nativeElement.disabled).toBeFalsy();
      }
  });

});
