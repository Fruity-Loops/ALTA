import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateMembersComponent } from './create-members.component';

describe('CreateMembersComponent', () => {
  let component: CreateMembersComponent;
  let fixture: ComponentFixture<CreateMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

});
