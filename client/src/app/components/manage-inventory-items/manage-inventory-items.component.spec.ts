import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageInventoryItemsService } from 'src/app/services/inventory-items/manage-inventory-items.service';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageInventoryItemsComponent } from './manage-inventory-items.component';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module'

describe('ManageInventoryItemsComponent', () => {
  let component: ManageInventoryItemsComponent;
  let fixture: ComponentFixture<ManageInventoryItemsComponent>;
  // @ts-ignore
  let service: ManageInventoryItemsService;
  // @ts-ignore
  let service2: ManageAuditsService;
  // @ts-ignore
  let service3: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageInventoryItemsComponent],
      providers: [
        FormBuilder,
        { provide: ManageInventoryItemsService },
        { provide: ManageAuditsService },
        { provide: AuthService },
      ],
      imports: [HttpClientModule, RouterTestingModule, AppModule],
    });

    fixture = TestBed.createComponent(ManageInventoryItemsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageInventoryItemsService);
    service2 = TestBed.inject(ManageAuditsService);
    service3 = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create Inventory Items Component', () => {
    expect(component).toBeTruthy();
  });

  // Test that Start Audit button is disabled when no items selected
  it('should disable Start button when no item selected', () => {
    fixture.detectChanges();
    spyOn(component.router, 'navigate');
    const button = fixture.debugElement.query(By.css('#create'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });
});
