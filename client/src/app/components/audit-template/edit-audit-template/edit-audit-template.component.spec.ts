import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EditAuditTemplateComponent } from './edit-audit-template.component';
import { AuditTemplateService } from 'src/app/services/audit-template.service';

describe('AuditTemplateComponent', () => {
  let component: EditAuditTemplateComponent;
  let fixture: ComponentFixture<EditAuditTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAuditTemplateComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
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
    fixture = TestBed.createComponent(EditAuditTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
