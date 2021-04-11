import {ComponentFixture, TestBed} from '@angular/core/testing';
import {GreetingComponent} from './greeting.component';
import { AppModule } from 'src/app/app.module';

describe('AuthTabsComponent', () => {
  let component: GreetingComponent;
  let fixture: ComponentFixture<GreetingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GreetingComponent],
      imports: [AppModule]
    }).compileComponents();
    fixture = TestBed.createComponent(GreetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('should create auth tabs component', () => {
    expect(component).toBeTruthy();
  });
});
