import {ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateAuditTemplateComponent } from './create-audit-template.component';
import { AuditTemplateService } from 'src/app/services/audits/audit-template.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import {of} from 'rxjs';

describe('CreateAuditTemplateComponent', () => {
  let component: CreateAuditTemplateComponent;
  let fixture: ComponentFixture<CreateAuditTemplateComponent>;

  // @ts-ignore
  let service: AuditTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAuditTemplateComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatAutocompleteModule,
        AppModule
      ],
      providers: [
        FormBuilder,
        {
          provide: AuditTemplateService,
        },
      ],
    }).compileComponents();


    service = TestBed.inject(AuditTemplateService);
    fixture = TestBed.createComponent(CreateAuditTemplateComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    service = null;
    fixture = null;
    component = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display check box error to choose one day', () => {
    component.initializeForm();
    component.checkLeadingZero('h');
    component.checkLeadingZero('hel');
    component.panelOpenState = true;
    component.submitQuery({
      Location: '',
      Plant: '',
      Zone: '',
      Aisle: '',
      Bin: '',
      Part_Number: '',
      Serial_Number: '',
      start_date: '',
      repeat_every: '',
      on_day: '',
      for_month: '',
      time_zone_utc: '',
    });
    expect(component.errorMessageCheckboxDay).toBe('Please choose at least one day');
  });

  it('should display check box error to choose one month', () => {
    component.panelOpenState = true;
    component.isRecurrenceChosen = true;
    component.recurrenceMonth.subCheckBox[0].checked = false;
    component.submitQuery({
      Location: '',
      Plant: '',
      Zone: '',
      Aisle: '',
      Bin: '',
      Part_Number: '',
      Serial_Number: '',
      start_date: '',
      repeat_every: '',
      on_day: '',
      for_month: '',
      time_zone_utc: '',
    });
    expect(component.errorMessageCheckboxMonth).toBe('Please choose at least one month');
  });

  it('should call ', fakeAsync(() => {
    component.panelOpenState = false;
    spyOn(service, 'createTemplate').and.returnValue(of(null));
    component.submitQuery({
      Location: '',
      Plant: '',
      Zone: '',
      Aisle: '',
      Bin: '',
      Part_Number: '',
      Serial_Number: '',
      start_date: '',
      repeat_every: '',
      on_day: '',
      for_month: '',
      time_zone_utc: '',
    });
    flush();
    expect(component.templateValues.Location).toBe('');
  }));


  it('Ensure setAllCheckBoxMonth + Day dont set to true if null', () => {
    component.filter('hello', 'hi');
    component.recurrenceDay.subCheckBox = null;
    component.recurrenceMonth.subCheckBox = null;
    component.setAllCheckboxMonth(true);
    component.setAllCheckboxDay(true);
    expect(component.recurrenceMonth.subCheckBox).toBe(null);
    expect(component.recurrenceDay.subCheckBox).toBe(null);
  });

  it('checking setAllCheckBoxMonth and setAllCheckBoxDay', () => {
    component.setAllCheckboxMonth(true);
    component.setAllCheckboxDay(true);
    expect(component.recurrenceMonth.subCheckBox[1].checked).toBe(true);
    expect(component.recurrenceDay.subCheckBox[1].checked).toBe(true);
  });

  it('check open and close, and adding + removing item', () => {
    component.recurrenceExpand();
    component.recurrenceCollapsed();
    component.addItem('Bin', ' ');
    component.remove('Bin', ' ');
  });

});
