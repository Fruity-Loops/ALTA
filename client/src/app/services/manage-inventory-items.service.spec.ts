import {TestBed} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {ManageInventoryItemsService} from './manage-inventory-items.service';

describe('ManageInventoryItemsService', () => {
  let service: ManageInventoryItemsService;
  //@ts-ignore
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ManageInventoryItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
