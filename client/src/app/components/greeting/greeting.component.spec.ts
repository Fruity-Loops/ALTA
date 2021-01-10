import {ComponentFixture, TestBed} from '@angular/core/testing';
import {GreetingComponent} from './greeting.component';

describe('AuthTabsComponent', () => {
  let component: GreetingComponent;
  let fixture: ComponentFixture<GreetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GreetingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create auth tabs component', () => {
    expect(component).toBeTruthy();
  });
});
