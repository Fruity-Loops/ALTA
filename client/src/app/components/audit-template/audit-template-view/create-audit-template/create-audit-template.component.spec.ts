import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CreateAuditTemplateComponent } from './create-audit-template.component';
import { AuditTemplateService } from 'src/app/services/audits/audit-template.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('AuditTemplateComponent', () => {
  let component: CreateAuditTemplateComponent;
  let fixture: ComponentFixture<CreateAuditTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAuditTemplateComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatAutocompleteModule
      ],
      providers: [
        FormBuilder,
        {
          provide: AuditTemplateService,
        },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAuditTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
