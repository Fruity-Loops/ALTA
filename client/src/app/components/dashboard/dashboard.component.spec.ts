import {ComponentFixture, TestBed, fakeAsync, flush} from '@angular/core/testing';
import {ManageAuditsService} from 'src/app/services/audits/manage-audits.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {DashboardComponent} from './dashboard.component';
import {FormBuilder} from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { of } from 'rxjs';
import { audit } from 'rxjs/operators';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  // @ts-ignore
  let service: ManageAuditsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        FormBuilder,
        { provide: ManageAuditsService}
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule],
    }).compileComponents();
    service = TestBed.inject(ManageAuditsService);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    service = null;
  });

  it('should create Dashboard Component', fakeAsync(() => {
    const todos = [{id: 1}];
    spyOn(service, 'getProperAudits').and.returnValue(of( todos ));
    expect(component).toBeTruthy();
    flush();
  }));

  // Test the retrieveData()
  it('Call retrieveData to populate the audit', fakeAsync(() => {
    try {
      component.retrieveData([{
        getDate : '03/30/2021',
        splitDate : '03 30 2021',
        dateObj : '03/30/2021',
        date : '03/30/2021',
        thirtyDaysAgo : '03/01/2021',
        audit,
        xData : 'datetime',
        yData : 'datetime',
      }]);
    }
    catch (errorMessage) {
      console.error(errorMessage);
    }
  }));

  // Test the retrieveData table
  it('Call retrieveData', () => {
    try {
      component.retrieveData(audit);
    }
    catch (err) {
      console.error(err);
    }
  });

});
