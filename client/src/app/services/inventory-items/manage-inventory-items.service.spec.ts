import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, } from '@angular/common/http/testing';
import { ManageInventoryItemsService } from './manage-inventory-items.service';
import { ManageInventoryItemsSpecVariables } from './manage-inventory-items-spec-variables';
import { HttpParams } from '@angular/common/http';
import { env } from 'src/environments/environment';

describe('ManageInventoryItemsService', () => {
  let service: ManageInventoryItemsService;
  let httpTestingController: HttpTestingController;
  const BASEURL = env.api_root;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageInventoryItemsService],
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ManageInventoryItemsService);
  });

  afterEach(() => {
    // Used to make sure there are no subscribe requests leftover
    httpTestingController.verify();
    httpTestingController = null;
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(httpTestingController).toBeTruthy();
  });

  it('should get items to display', () => {
    let params = new HttpParams();
    let pageIndex = 1;
    let pageSize = 25;
    let orgId = 1;
    params = params.append('page', String(pageIndex));
    params = params.append('page_size', String(pageSize));
    params = params.append('organization', String(orgId));

    service.getPageItems(params).subscribe(items => {
      expect(items).toEqual(ManageInventoryItemsSpecVariables.pageItems);
      for (let item of items.results)
      {
        expect(item.organization).toEqual(orgId);
      }
    });

    const req = httpTestingController.expectOne(`${BASEURL}/item/?` + params.toString());
    expect(req.request.method).toBe("GET");
    req.flush(ManageInventoryItemsSpecVariables.pageItems);
  });

  it('should get items from template', () => {
    let params = new HttpParams();
    const orgId = '1';
    const location = 'Florida';
    params = params.append('Location', String(location));
    params = params.append('organization', orgId);
    
    service.getTemplateItems(params).subscribe(items => {
      expect(items).toEqual(ManageInventoryItemsSpecVariables.itemsFromTemplate);
      for (let item of items)
      {
        expect(item.organization).toEqual(Number(orgId));
        expect(item.Location).toEqual(location);
      }
    });

    const req = httpTestingController.expectOne(`${BASEURL}/item/template/?` + params.toString());
    expect(req.request.method).toBe("GET");
    req.flush(ManageInventoryItemsSpecVariables.itemsFromTemplate);
  });
  
});
