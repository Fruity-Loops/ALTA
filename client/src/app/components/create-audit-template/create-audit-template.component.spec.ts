import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAuditTemplateComponent } from './create-audit-template.component';

describe('AuditTemplateComponent', () => {
  let component: CreateAuditTemplateComponent;
  let fixture: ComponentFixture<CreateAuditTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAuditTemplateComponent ]
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
