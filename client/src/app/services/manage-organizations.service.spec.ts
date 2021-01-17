import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import {ManageOrganizationsService} from './manage-organizations.service';

describe('ManageOrganizationsService', () => {
  let service: ManageOrganizationsService;

  // @ts-ignore
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ManageOrganizationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
