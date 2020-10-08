import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenService } from 'src/app/services/token.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let tokenService: TokenService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: TokenService,
        },
      ],
    }).compileComponents();

    tokenService = TestBed.inject(TokenService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
