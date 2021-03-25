import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { OrganizationSettingsService } from './organization-settings.service';

describe('OrganizationSettingsService', () => {
  let service: OrganizationSettingsService;
  // @ts-ignore
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(OrganizationSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
