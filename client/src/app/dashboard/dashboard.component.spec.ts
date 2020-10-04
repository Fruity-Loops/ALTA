import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Default Option
  it('#onSelect should set #selectedOption to "The First option"', () => {
    expect(component.selectedOption.title).toBe("Create My Account", 'Initial Option');
  });

  // Tests Options are clickable
  it('should test click 2nd option', () => {
    const theSpy = spyOn(component, 'onSelect');
    const elements = fixture.debugElement.queryAll(By.css('li'));
    elements.forEach(element => {
      fixture.detectChanges();
      element.nativeElement.click();
      expect(component.onSelect).toHaveBeenCalled();
      theSpy.calls.reset();
    });
  });

  // Tests 2nd option was clicked
  it('should test header changed to Modify My Account', () => {
    const elements = fixture.debugElement.queryAll(By.css('li'));
    elements[1].nativeElement.click();
    fixture.detectChanges();

    const paragraphDe = fixture.debugElement.query(By.css('h3'));
    const header: HTMLElement = paragraphDe.nativeElement;
    expect(header.textContent).toEqual('Current Setting: Modify My Account');
  });

});
