import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ManageAuditsService } from './manage-audits.service';

describe('ManageAuditsService', () => {
  let service: ManageAuditsService;
  // @ts-ignore
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ManageAuditsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
