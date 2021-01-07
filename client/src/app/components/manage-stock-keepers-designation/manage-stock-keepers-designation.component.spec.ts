import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStockKeepersDesignationComponent } from './manage-stock-keepers-designation.component';

describe('ManageStockKeepersDesignationComponent', () => {
  let component: ManageStockKeepersDesignationComponent;
  let fixture: ComponentFixture<ManageStockKeepersDesignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageStockKeepersDesignationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStockKeepersDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
