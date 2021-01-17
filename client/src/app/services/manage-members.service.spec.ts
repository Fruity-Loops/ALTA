import {TestBed} from '@angular/core/testing';
import {ManageMembersService} from './manage-members.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('ManageMembersService', () => {
  //@ts-ignore
  let httpTestingController: HttpTestingController;
  let service: ManageMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ManageMembersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
