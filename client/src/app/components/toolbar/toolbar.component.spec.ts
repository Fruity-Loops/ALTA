import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AuthService} from 'src/app/services/auth.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {SidenavService} from 'src/app/services/sidenav.service';
import {ToolbarComponent} from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  // @ts-ignore
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

});
