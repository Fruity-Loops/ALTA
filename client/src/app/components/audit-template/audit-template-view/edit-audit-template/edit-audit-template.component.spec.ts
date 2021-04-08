import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EditAuditTemplateComponent } from './edit-audit-template.component';
import { AuditTemplateService } from 'src/app/services/audits/audit-template.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AppModule } from 'src/app/app.module';

describe('EditAuditTemplateComponent', () => {
  let component: EditAuditTemplateComponent;
  let fixture: ComponentFixture<EditAuditTemplateComponent>;

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
    fixture = TestBed.createComponent(EditAuditTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
