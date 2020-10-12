
import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CoursesService', () => {
  let httpTestingController: HttpTestingController;
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService],
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DashboardService);
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
        const data = JSON.parse(jsonData);
        expect(data.user_name).toEqual('a');
        expect(data.email).toEqual('a@gmail.com');
        expect(data.first_name).toEqual('a');
        expect(data.last_name).toEqual('a');
        expect(data.role).toEqual('SA');
      });

    // This is where the request should be
    const req = httpTestingController.expectOne('http://localhost:8000/getAllClients/');

    expect(req.request.method).toEqual('GET');

    // respond with the mock data that we pass as a parameter, and that causes the Observable to resolve for 43-47
    req.flush(mockUser);
  });
});
