import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyClientRoleComponent } from './modify-client-role.component';

describe('ModifyClientRoleComponent', () => {
  let component: ModifyClientRoleComponent;
  let fixture: ComponentFixture<ModifyClientRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyClientRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyClientRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
