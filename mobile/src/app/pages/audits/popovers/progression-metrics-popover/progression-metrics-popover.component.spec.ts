import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProgressionMetricsPopoverComponent } from './progression-metrics-popover.component';

describe('ProgressionMetricsPopoverComponent', () => {
  let component: ProgressionMetricsPopoverComponent;
  let fixture: ComponentFixture<ProgressionMetricsPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressionMetricsPopoverComponent ],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressionMetricsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
