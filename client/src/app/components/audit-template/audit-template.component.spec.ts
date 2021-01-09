import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuditTemplateComponent } from './audit-template.component';

describe('AuditTemplateComponent', () => {
  let component: AuditTemplateComponent;
  let fixture: ComponentFixture<AuditTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditTemplateComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
