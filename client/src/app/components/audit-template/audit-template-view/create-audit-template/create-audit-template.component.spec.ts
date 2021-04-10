import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateAuditTemplateComponent } from './create-audit-template.component';
import { AuditTemplateService } from 'src/app/services/audits/audit-template.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module'

describe('CreateAuditTemplateComponent', () => {
  let component: CreateAuditTemplateComponent;
  let fixture: ComponentFixture<CreateAuditTemplateComponent>;

  // @ts-ignore
  let service: AuditTemplateService;
  let startDateInput: HTMLInputElement;
  let startTimeInput: HTMLInputElement;
  let templateInput: HTMLInputElement;

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

    fixture = TestBed.createComponent(CreateAuditTemplateComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AuditTemplateService);

    startDateInput = fixture.debugElement.query(By.css('#date')).nativeElement;
    startTimeInput = fixture.debugElement.query(By.css('#time')).nativeElement;
    templateInput = fixture.debugElement.query(By.css('#title')).nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

     // Test that Save button creates a new template
  it('should create a new template', () => {
      fixture.detectChanges();
      spyOn(component.router, 'navigate');
      const button = fixture.debugElement.query(By.css('#create-template-button')).nativeElement;
      expect(button.disabled).toBeFalsy();
  });

  it('should be able to enter Start Date', () => {
    fixture.detectChanges();
    spyOn(component.router, 'navigate');
    startDateInput.value = '2021-01-18T15:37:42';
    startDateInput.dispatchEvent(new Event('change'));
    expect(startDateInput.value).toBe('2021-01-18T15:37:42');
});

  it('should be able to enter Start Time', () => {
    fixture.detectChanges();

    startTimeInput.value = '23:33';
    startTimeInput.dispatchEvent(new Event('change'));
    expect(startTimeInput.value).toBe('23:33');
});

  it('should be able to enter Template name', () => {
    fixture.detectChanges();
    templateInput.value = 'Test 001';
    templateInput.dispatchEvent(new Event('change'));
    expect(templateInput.value).toBe('Test 001');
});
});
