
import { TestBed } from '@angular/core/testing';
import { ManageMembersService } from './manage-members.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ManageMembersService', () => {
  let httpTestingController: HttpTestingController;
  let service: ManageMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageMembersService],
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ManageMembersService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returned Observable should match the right data', () => {
    const mockUser = {
      user_name: 'a',
      email: 'a@gmail.com',
      first_name: 'a',
      last_name: 'a',
      role: 'SA'
    };

    service.getAllClients()
      .subscribe(jsonData => {
        const data = jsonData;
        expect(data.user_name).toEqual(mockUser.user_name);
        expect(data.email).toEqual(mockUser.email);
        expect(data.first_name).toEqual(mockUser.first_name);
        expect(data.last_name).toEqual(mockUser.last_name);
        expect(data.role).toEqual(mockUser.role);
      });

    // This is where the request should be
    const req = httpTestingController.expectOne(service.BASEURL + '/getAllClients/');

    expect(req.request.method).toEqual('GET');

    // respond with the mock data that we pass as a parameter, and that causes the Observable to resolve for 43-47
    req.flush(mockUser);
  });
});
