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
  // let startDateInput: HTMLInputElement;
  // let startTimeInput: HTMLInputElement;
  // let templateInput: HTMLInputElement;

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

    // startDateInput = fixture.debugElement.query(By.css('#date')).nativeElement;
    // startTimeInput = fixture.debugElement.query(By.css('#time')).nativeElement;
    // templateInput = fixture.debugElement.query(By.css('#title')).nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    service = null;
    fixture = null;
    component = null;
    // startDateInput = null;
    // startTimeInput = null;
    // templateInput = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

//      // Test that Save button creates a new template
//   it('should create a new template', () => {
//       fixture.detectChanges();
//       const button = fixture.debugElement.query(By.css('#create-template-button')).nativeElement;
//       expect(button.disabled).toBeFalsy();
//   });
//
//   it('should be able to enter Start Date', () => {
//     fixture.detectChanges();
//     startDateInput.value = '2021-01-18T15:37:42';
//     startDateInput.dispatchEvent(new Event('change'));
//     expect(startDateInput.value).toBe('2021-01-18T15:37:42');
// });
//
//   it('should be able to enter Start Time', () => {
//     fixture.detectChanges();
//
//     startTimeInput.value = '23:33';
//     startTimeInput.dispatchEvent(new Event('change'));
//     expect(startTimeInput.value).toBe('23:33');
// });
//
//   it('should be able to enter Template name', () => {
//     fixture.detectChanges();
//     templateInput.value = 'Test 001';
//     templateInput.dispatchEvent(new Event('change'));
//     expect(templateInput.value).toBe('Test 001');
// });
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

/*
* The test below is commented out is to show as an example how to setup test
*/

  // // Test the submitQuery()
  // it('Call method', () => {
  //   component.submitQuery({
  //     location: '',
  //     plant: '',
  //     zones: '',
  //     aisles: '',
  //     bins: '',
  //     part_number: '',
  //     serial_number: '',
  //     start_date: '',
  //     repeat_every: '',
  //     on_day: '',
  //     for_month: '',
  //     time_zone_utc: '',
  //     });
  //     expect(component.errorMessage).toBe('Please choose at least one day');
  //   });

  // it('should be able to submit a new query', () => {
  //   try {
  //     component.submitQuery([{
  //       dayArray: [],
  //       monthArray: [],
  //       year: 2020,
  //       month: ,
  //       day: ,
  //       hour: ,
  //       minute: ,
  //     }])
  //   }
  //   catch (error) {
  //   console.error(error);
  //   }
  // });
});
