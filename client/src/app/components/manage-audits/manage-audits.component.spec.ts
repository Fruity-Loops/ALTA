import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageInventoryItemsService } from 'src/app/services/inventory-items/manage-inventory-items.service';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageAuditsComponent } from './manage-audits.component';
import { FormBuilder } from '@angular/forms';

describe('ManageInventoryItemsComponent', () => {
  let component: ManageAuditsComponent;
  let fixture: ComponentFixture<ManageAuditsComponent>;
  // @ts-ignore
  let service: ManageInventoryItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageAuditsComponent],
      providers: [
        FormBuilder,
        { provide: ManageAuditsService },
      ],
      imports: [HttpClientModule, RouterTestingModule],
    });

    fixture = TestBed.createComponent(ManageAuditsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageInventoryItemsService);
    fixture.detectChanges();
  });

  it('should create Inventory Items Component', () => {
    expect(component).toBeTruthy();
  });
});
