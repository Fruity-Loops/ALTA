import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ManageInventoryItemsService} from 'src/app/services/inventory-items/manage-inventory-items.service';
import {ManageAuditsService} from 'src/app/services/audits/manage-audits.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {DashboardComponent} from './dashboard.component';
import {FormBuilder} from '@angular/forms';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  // @ts-ignore
  let service: ManageInventoryItemsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        FormBuilder,
        {provide: ManageAuditsService},
      ],
      imports: [HttpClientModule, RouterTestingModule],
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManageInventoryItemsService);
    fixture.detectChanges();
  });

  it('should create Dashboard Component', () => {
    expect(component).toBeTruthy();
  });
});
