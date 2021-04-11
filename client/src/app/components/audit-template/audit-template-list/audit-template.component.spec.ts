import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuditTemplateComponent } from './audit-template.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AppModule } from 'src/app/app.module';
import {ManageInventoryItemsService} from '../../../services/inventory-items/manage-inventory-items.service';
import {of, throwError} from 'rxjs';
import {AuditTemplateService} from '../../../services/audits/audit-template.service';

describe('AuditTemplateComponent', () => {
  let component: AuditTemplateComponent;
  let fixture: ComponentFixture<AuditTemplateComponent>;
  let service: ManageInventoryItemsService;
  let templateService: AuditTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditTemplateComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule, AppModule],
      providers: [
        {
          provide: ManageInventoryItemsService
        }
      ]
    }).compileComponents();

    service = TestBed.inject(ManageInventoryItemsService);
    templateService = TestBed.inject(AuditTemplateService);
    fixture = TestBed.createComponent(AuditTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    service = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hello', () => {
    spyOn(service, 'getTemplateItems').and.returnValues(of([1, 2, 3]), of([]), throwError('hello'));
    component.getItemsForTemplate({
      Location: '["YUL"]'
    }, 'hello');
    component.getItemsForTemplate({
      Location: '["YUL"]'
    }, 'hello');
    component.getItemsForTemplate({
      Location: '["YUL"]'
    }, 'hello');
  });

  it('hi', () => {
    spyOn(templateService, 'getAuditTemplates').and.returnValues(of([{title: 'data'}]), throwError('hi'));
    component.getAuditTemplates();
    expect(component.auditTemplates[0].title).toBe('data');
    component.getAuditTemplates();
    expect(component.errorMessage).toBe('hi');
  });
});
