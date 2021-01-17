import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageInventoryItemsService } from 'src/app/services/manage-inventory-items.service';
import { ManageAuditsService } from 'src/app/services/manage-audits.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageInventoryItemsComponent } from './manage-inventory-items.component';
import { FormBuilder } from '@angular/forms';

describe('ManageInventoryItemsComponent', () => {
  let component: ManageInventoryItemsComponent;
  let fixture: ComponentFixture<ManageInventoryItemsComponent>;
  // @ts-ignore
  let service: ManageInventoryItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageInventoryItemsComponent],
      providers: [
        FormBuilder,
        { provide: ManageInventoryItemsService },
        { provide: ManageAuditsService },
      ],
      imports: [HttpClientModule, RouterTestingModule],
    });

    fixture = TestBed.createComponent(ManageInventoryItemsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageInventoryItemsService);
    fixture.detectChanges();
  });

  it('should create Inventory Items Component', () => {
    expect(component).toBeTruthy();
  });
});
