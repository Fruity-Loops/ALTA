import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SideNavComponent } from './sidenav.component';
import { SideNavListings } from './sidenavListing';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;
  let authService: AuthService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideNavComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: AuthService,
        }
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('check all list items are there', () => {
    const elements = fixture.debugElement.queryAll(By.css('#option'));
    const subElements = fixture.debugElement.queryAll(By.css('#subOption'));
    let index = 0;
    let subMenuList = [];
    // Check parent elements
    elements.forEach(element => {
      expect(element.nativeElement.textContent).toBe(SideNavListings[index].title);
      if (SideNavListings[index].subMenuOptions.length > 0) {
        subMenuList = subMenuList.concat(SideNavListings[index].subMenuOptions);
      }
      index++;
    });
    index = 0;
    // Check child elements
    subElements.forEach(element => {
      expect(element.nativeElement.textContent).toBe(subMenuList[index].title);
      index++;
    });
  });
});
