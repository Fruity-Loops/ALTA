import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageStockKeepersDesignationComponent } from './manage-stock-keepers-designation.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ManageMembersService } from 'src/app/services/manage-members.service';
import { ManageAuditsService } from 'src/app/services/manage-audits.service';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

describe('ManageStockKeepersDesignationComponent', () => {
  let component: ManageStockKeepersDesignationComponent;
  let fixture: ComponentFixture<ManageStockKeepersDesignationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageStockKeepersDesignationComponent],
      providers: [
        FormBuilder,
        { provide: ManageMembersService },
        { provide: ManageAuditsService }
      ],
      imports: [HttpClientModule, RouterTestingModule, MatDialogModule ],
    });

    fixture = TestBed.createComponent(ManageStockKeepersDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Manage Stock-Keepers Designation Component', () => {
    expect(component).toBeTruthy();
  });
});
