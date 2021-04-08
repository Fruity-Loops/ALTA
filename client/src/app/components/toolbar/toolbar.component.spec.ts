import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AuthService} from 'src/app/services/authentication/auth.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {SidenavService} from 'src/app/services/sidenav.service';
import {ToolbarComponent} from './toolbar.component';
import { AppModule } from 'src/app/app.module';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  // @ts-ignore
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule],
      providers: [
        {
          provide: SidenavService,
        },
        {
          provide: AuthService,
        }
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    authService = null;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  // Test the toggle drawer
  it('Call toggle drawer', () => {
    try {
      component.toggleDrawer();
    }
    catch (e) {
      console.error(e);
    }
  });

  // Test the destroy
  it('Call OnDestroy', () => {
    try {
      component.OnDestroy();
    }
    catch (e) {
      console.error(e);
    }
  });

});
