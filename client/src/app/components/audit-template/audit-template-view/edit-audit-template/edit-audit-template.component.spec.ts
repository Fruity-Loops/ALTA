import {ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EditAuditTemplateComponent } from './edit-audit-template.component';
import { AuditTemplateService } from 'src/app/services/audits/audit-template.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AppModule } from 'src/app/app.module';
import {of, throwError} from 'rxjs';

describe('EditAuditTemplateComponent', () => {
  let component: EditAuditTemplateComponent;
  let fixture: ComponentFixture<EditAuditTemplateComponent>;
  let service: AuditTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAuditTemplateComponent],
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
    fixture = TestBed.createComponent(EditAuditTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('', () => {
    spyOn(service, 'getATemplate').and.returnValue(of({
      title: 'hello', description: 'hi', id: 'id', Bin: '[\'A10\''}));
    component.initializeForm();
  });

  it('test setComponentParameters', () => {
    component.setComponentParameters(false);
    expect(component.disabled).toBe(false);
    component.setComponentParameters({
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
    expect(component.disabled).toBe(true);
  });

  it('test submitQuery', fakeAsync(() => {
    const errmsg = 'induced error';
    const spy = spyOn(service, 'updateTemplate');
    spy.and.returnValue(throwError({error: errmsg}));
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
    expect(component.errorMessage).toBe(errmsg);
    spy.calls.reset();
  }));

  it('', () => {
    component.beginEdit();
    expect(component.disabled).toBe(false);
    expect(component.formTemplate({Bin: '[\'A10\', \'B20\']'}).Bin[0]).toBe('A10');
  });
});
