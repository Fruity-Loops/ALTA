import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should set a token', () => {
    service.SetToken('Token');
    expect(service.GetToken()).toBe('Token');
  });

  it('should get token', () => {
    expect(service.GetToken()).toBe('Token');
  });
});
