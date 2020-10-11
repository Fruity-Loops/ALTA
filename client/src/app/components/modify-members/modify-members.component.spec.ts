import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyMembersComponent } from './modify-members.component';

describe('ModifyMembersComponent', () => {
  let component: ModifyMembersComponent;
  let fixture: ComponentFixture<ModifyMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

});
