import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageInventoryItemsService } from 'src/app/services/inventory-items/manage-inventory-items.service';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageAuditsComponent } from './manage-audits.component';
import { FormBuilder } from '@angular/forms';
import { AppModule } from 'src/app/app.module';

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
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule],
    });

    service = TestBed.inject(ManageInventoryItemsService);
    fixture = TestBed.createComponent(ManageAuditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    service = null;
  });

  it('should create Inventory Items Component', () => {
    expect(component).toBeTruthy();
  });
});
