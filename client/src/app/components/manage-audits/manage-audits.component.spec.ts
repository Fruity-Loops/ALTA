import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageInventoryItemsService } from 'src/app/services/inventory-items/manage-inventory-items.service';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageAuditsComponent } from './manage-audits.component';
import { FormBuilder } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import {of, throwError} from 'rxjs';
import {DashboardService} from '../../services/dashboard/dashboard.service';

describe('ManageInventoryItemsComponent', () => {
  let component: ManageAuditsComponent;
  let fixture: ComponentFixture<ManageAuditsComponent>;
  // @ts-ignore
  let service: ManageInventoryItemsService;
  let auditService: ManageAuditsService;
  let dashService: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageAuditsComponent],
      providers: [
        FormBuilder,
        { provide: ManageAuditsService },
        { provide: DashboardService }
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule],
    });

    service = TestBed.inject(ManageInventoryItemsService);
    auditService = TestBed.inject(ManageAuditsService);
    dashService = TestBed.inject(DashboardService);
    fixture = TestBed.createComponent(ManageAuditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    service = null;
    auditService = null;
  });

  it('should create Inventory Items Component', () => {
    expect(component).toBeTruthy();
  });

  it('test getProperAudits', () => {
    spyOn(auditService, 'getProperAudits').and.returnValues(of([{
      initiated_on: '25 12 1996',
      accuracy: 0.5
    }]), throwError('hello'));
    component.searchAudit();
    component.searchAudit();
  });

  it('testing filterAuditData', () => {
    const result = component.filterAuditData([{
      Bin: 'A10',
      Location: 'YUL',
      status: 'active',
      Quantity: 1,
      ToRemove: 'I should be removed',
    }]);
    expect(result[0].ToRemove).toBe(undefined);
    expect(result[0].Bin).toBe('A10');
  });

  it('testing filterBinToSkData', () => {
    const result = component.filterBinToSKData([{
      customuser: {location: 'YUL', first_name: 'nick', last_name: 'nagy'},
      Bin: 'A10',
      accuracy: 0.5,
      ToRemove: 'remove me'
    }]);
    expect(result[0].ToRemove).toBe(undefined);
    expect(result[0].location).toBe('YUL');
  });

  it('testing displayWarningMessage', () => {
    component.displayWarningMessage('Active');
    expect(component.ongoingAudit).toBeTruthy();
    component.displayWarningMessage('Inactive');
    expect(component.ongoingAudit).toBeFalsy();
  });

  it('testing getCorrespondingData', () => {
    const result = component.getCorrespondingData([{
        Location: 'YUL',
        id: 'findthisone',
        Bin: 'A10'
      }, {
        Location: undefined,
        id: 'dont find this one',
        Bin: 'B12'
      }], {
        Location: 'YUL',
        Bin: 'A10'
      }
    );
    expect(result.id).toBe('findthisone');
    const resultnoundefined = component.getCorrespondingData([{
      location: 'YUL',
      id: 'findthisone',
      Bin: 'A10'
    }], {
      Location: 'YUL',
      Bin: 'A10'
    });
    expect(resultnoundefined.id).toBe('findthisone');
  });

  it('test setInnerTable', () => {
    component.setInnerTable([{
      Location: 'YUL',
      Bin: 'A10',
      Quantity: 10,
      status: 'Missing'
    }, {
      Location: 'YUL',
      Bin: 'A10',
      Quantity: 10,
      status: 'Provided'
    }, {
      Location: 'YUL',
      Bin: 'A10',
      status: 'New'
    }], [{
      location: 'YUL',
      Bin: 'A10'
    }]);
    expect(component.innerDisplayedColumns).toEqual(['Location',
      'Bin',
      'Assigned_Employee',
      'Bin_Accuracy',
      'Number_of_Audited_Items',
      'Number_of_Provided_Items',
      'Number_of_Missing_Items',
      'Number_of_New_Items']);
  });

  it('test getRecommendations', () => {
    spyOn(dashService, 'getRecommendations').and.returnValues(of({
      bins_recommendation: 'sourcebin',
      parts_recommendation: 'sourcepart',
      items_recommendation: 'sourceitem',
      random_items: 'randomitem',
      item_based_on_category: 'category'
    }), throwError('error!'));
    component.getRecommendations();
    expect(component.dataSourceBin).toBe('sourcebin');
    component.getRecommendations();
    expect(component.errorMessage).toBe('error!');
  });

  it('test getInsights', () => {
    spyOn(auditService, 'getInsights').and.returnValues(of({
      last_week_audit_count: 1,
      last_month_audit_count: 1,
      last_year_audit_count: 1,
      average_accuracy: 0.5,
      average_audit_time: {
        seconds: 1,
        minutes: 1,
        hours: 1,
        days: 1
      }
    }), throwError('error!'));
    component.getInsights();
    expect(component.last_week_audit_count).toBe(1);
    component.getInsights();
    expect(component.errorMessage).toBe('error!');
  });

  it('test updatePage', () => {
    spyOn(auditService, 'getProperAudits').and.returnValues(of({
      test: 0
    }), throwError('error!'));
    component.updatePage();
    expect(component.data.test).toBe(0);
    component.updatePage();
    expect(component.errorMessage).toBe('error!');
  });
});
