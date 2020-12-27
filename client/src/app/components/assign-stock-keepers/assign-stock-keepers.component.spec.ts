import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignStockKeepersComponent } from './assign-stock-keepers.component';

describe('AssignStockKeepersComponent', () => {
  let component: AssignStockKeepersComponent;
  let fixture: ComponentFixture<AssignStockKeepersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignStockKeepersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignStockKeepersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
