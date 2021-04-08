import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ManageAuditsService, AuditLocalStorage } from './manage-audits.service';
import { env } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

describe('ManageAuditsService', () => {
  let service: ManageAuditsService;
  // @ts-ignore
  let httpTestingController: HttpTestingController;
  const BASEURL = env.api_root;

  let store = {};
  const mockLocalStorage = {
    getItem: (key: string): string => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ManageAuditsService
      ],
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ManageAuditsService);

    // Mimic Local storage
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
  });

  // Used to make sure there are no subscribe requests leftover
  afterEach(() => {
    httpTestingController.verify();
    mockLocalStorage.clear();
    httpTestingController = null;
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(httpTestingController).toBeTruthy();
  });

  it('should store the audit id in localStorage',
    () => {
      service.updateLocalStorage(AuditLocalStorage.AuditId, '4');
      expect(localStorage.setItem).toHaveBeenCalledWith('audit_id', '4');
  });
  
  it('should return the audit id from localStorage',
    () => {
      localStorage.setItem('AuditId', '4');
      service.getLocalStorage(AuditLocalStorage.AuditId);
      expect(localStorage.getItem).toHaveBeenCalledWith('audit_id');
  });

  it('should delete the audit id from localStorage',
    () => {
      localStorage.setItem('AuditId', '6');
      service.removeFromLocalStorage(AuditLocalStorage.AuditId);
      expect(localStorage.removeItem).toHaveBeenCalledWith('audit_id');
  });
  

  it('should return a created audit from the items sent', () => {
    const auditCreationInfo = {
      initiated_by: 2,
      inventory_items: ["12752843", "12731370"],
      organization: 1
    };
    const auditReturnInfo = {
      'audit_id': 10,
      'initiated_on': '2021-04-07T22:31:34.833840Z',
      'last_modified_on': '2021-04-07T22:31:34.833858Z',
      'accuracy': 0.0,
      'status': 'Pending',
      'organization': 1,
      'initiated_by': 2,
      'template_id': null,
      'inventory_items': ['12752843', '12731370'],
      'assigned_sk': []
    };

    service.createAudit(auditCreationInfo).subscribe(audit => {
      expect(audit).toEqual(auditReturnInfo);
      expect(audit.initiated_by).toEqual(auditCreationInfo.initiated_by);
      expect(audit.inventory_items).toEqual(auditCreationInfo.inventory_items);
      expect(audit.organization).toEqual(auditCreationInfo.organization);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/`);
    expect(req.request.method).toBe("POST");
    req.flush(auditReturnInfo);
  });

  it('should delete the audit based on the id sent', () => {
    let auditId = 1;
    service.deleteAudit(auditId).subscribe(audit => {
      expect(audit).toEqual(null);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/${auditId}/`);
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });

  it('should return the patched audit based on the info sent', () => {
    let skToAssign = 1;
    let auditId = 1;
    let bodyAssignedSK = {assigned_sk: [skToAssign]};
    let returnedAudit = {
      'audit_id': auditId,
      'initiated_on': '2021-02-04T21:57:00.012000Z',
      'last_modified_on': '2021-04-08T00:17:54.142381Z',
      'accuracy': 100.0,
      'status': 'Active',
      'organization': 1,
      'initiated_by': 2,
      'template_id': null,
      'inventory_items': ['12731370', '12752843'],
      'assigned_sk': [skToAssign]
    }

    service.assignSK(bodyAssignedSK, auditId).subscribe(audit => {
      expect(audit).toEqual(returnedAudit);
      expect(audit.assigned_sk).toEqual(bodyAssignedSK.assigned_sk);
      expect(audit.audit_id).toEqual(auditId);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/${auditId}/`);
    expect(req.request.method).toBe("PATCH");
    req.flush(returnedAudit);
  });

  it('should assign the appropriate SK to the audit', () => {
    let skToAssign = 1;
    let auditId = 1;
    let assignments = [{assigned_sk: skToAssign, audit: auditId, seen: false}];
    let returnedAssignment = [{
      assigned_sk: skToAssign,
      audit: auditId,
      id: 2,
      seen: false,
      seen_on: "2021-04-08T00:29:07.052096Z"
    }];

    service.createAuditAssignments(assignments).subscribe(returnedAssignments => {
      expect(returnedAssignments).toEqual(returnedAssignment);
      expect(returnedAssignments[0].assigned_sk).toEqual(assignments[0].assigned_sk);
      expect(returnedAssignments[0].audit).toEqual(assignments[0].audit);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/assignment/`);
    expect(req.request.method).toBe("POST");
    req.flush(returnedAssignment);
  });

  it('should return the appropriate audit', () => {
    let auditId = 1;
    let returnedAudit = {
      'audit_id': auditId,
      'initiated_on': '2021-02-04T21:57:00.012000Z',
      'last_modified_on': '2021-04-08T00:17:54.142381Z',
      'accuracy': 100.0,
      'status': 'Active',
      'organization': 1,
      'initiated_by': 2,
      'template_id': null,
      'inventory_items': ['12731370', '12752843'],
      'assigned_sk': [3]
    }

    service.getAuditData(auditId).subscribe(audit => {
      expect(audit).toEqual(returnedAudit);
      expect(audit.audit_id).toEqual(auditId);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/${auditId}/`);
    expect(req.request.method).toBe("GET");
    req.flush(returnedAudit);
  });

  it('should return the active SKs', () => {
    let auditId = 1;
    let params = {organization: '1', status: 'Active', no_pagination: 'True'}
    let returnedAudits = [
      {audit_id: 1, inventory_items: Array(2), assigned_sk: Array(1), initiated_on: "2021-02-04T21:57:00.012000Z", last_modified_on: null, organization: 1, status: "Active", template_id: null},
      {audit_id: 2, inventory_items: Array(2), assigned_sk: Array(1), initiated_on: "2021-02-04T21:57:00.012000Z", last_modified_on: null, organization: 1, status: "Active", template_id: null},
      {audit_id: 4, inventory_items: Array(1), assigned_sk: Array(1), initiated_on: "2021-02-04T21:57:00.012000Z", last_modified_on: null, organization: 1, status: "Active", template_id: null},
      {audit_id: 5, inventory_items: Array(1), assigned_sk: Array(1), initiated_on: "2021-02-04T21:57:00.012000Z", last_modified_on: null, organization: 1, status: "Active", template_id: null},
      {audit_id: 6, inventory_items: Array(1), assigned_sk: Array(1), initiated_on: "2021-02-04T21:57:00.012000Z", last_modified_on: null, organization: 1, status: "Active", template_id: null},
      {audit_id: 7, inventory_items: Array(2), assigned_sk: Array(1), initiated_on: "2021-02-04T21:57:00.012000Z", last_modified_on: null, organization: 1, status: "Active", template_id: null},
      {audit_id: 8, inventory_items: Array(2), assigned_sk: Array(1), initiated_on: "2021-02-04T21:57:00.012000Z", last_modified_on: null, organization: 1, status: "Active", template_id: null},
      {audit_id: 9, inventory_items: Array(2), assigned_sk: Array(1), initiated_on: "2021-03-31T07:41:07.403000Z", last_modified_on: "2021-03-31T07:42:32.790000Z", organization: 1, status: "Active", template_id: null}
    ]

    service.getAuditData(auditId).subscribe(audits => {
      expect(audits).toEqual(returnedAudits);
      for (let audit of audits)
      {
        expect(audit.status).toEqual(params.status);
        expect(audit.organization).toEqual(Number(params.organization))
      }
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/${auditId}/`);
    expect(req.request.method).toBe("GET");
    req.flush(returnedAudits);
  });

  it('should return the audits properly formatted', () => {
    let params = new HttpParams();
    let pageIndex = 1;
    let pageSize = 25;
    params = params.append('page', String(pageIndex));
    params = params.append('page_size', String(pageSize));
    params = params.append('organization', String(localStorage.getItem('organization_id')));
    params = params.append('status', 'Active');

    let returnedAudits = [
      {
        "audit_id": 1,
        "initiated_on": "04/02/2021",
        "status": "Active",
        "accuracy": 100,
        "initiated_by": "inventory manager",
        "location": "Florida",
        "bin": "Multiple"
      },
      {
        "audit_id": 6,
        "initiated_on": "04/02/2021",
        "status": "Active",
        "accuracy": 100,
        "initiated_by": "inventory manager",
        "location": "Florida",
        "bin": "C69"
      },
      {
        "audit_id": 9,
        "initiated_on": "31/03/2021",
        "status": "Active",
        "accuracy": 1,
        "initiated_by": "inventory manager",
        "location": "Florida",
        "bin": "Multiple"
      }
  ]

    service.getProperAudits(params).subscribe(audits => {
      expect(audits).toEqual(returnedAudits);
      for (let audit of audits)
      {
        expect(audit.status).toEqual(params.get('status'));
      }
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/proper_audits/?`+ params.toString());
    expect(req.request.method).toBe("GET");
    req.flush(returnedAudits);
  });

  it('should initiate the pre audit', () => {
    let skToAssign = 3;
    let auditId = 17;
    let searchForThisBin = {
      "Bin": "C20",
      "init_audit": auditId,
      "customuser": skToAssign,
      "item_ids": [
          "12752843"
      ]
    };
    let returnedBin = {
      "bin_id": 8,
      "Bin": "C20",
      "item_ids": "['12752843']",
      "accuracy": 0,
      "status": "Pending",
      "init_audit": auditId,
      "customuser": skToAssign
  };

    service.initiatePreAudit(searchForThisBin).subscribe(returnedBinn => {
      expect(returnedBinn).toEqual(returnedBin);
      expect(returnedBinn.init_audit).toEqual(returnedBin.init_audit);
      expect(returnedBinn.customuser).toEqual(returnedBin.customuser);
      expect(returnedBinn.item_ids).toEqual(`['${searchForThisBin.item_ids}']`);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/bin-to-sk/`);
    expect(req.request.method).toBe("POST");
    req.flush(returnedBin);
  });

  it('should get the pre assigned audit', () => {
    let auditId = 19;
    let params = new HttpParams();
    params = params.append('init_audit_id', String(auditId));
    let returnedBins = [{
      "bin_id": 11,
      "customuser": {
          "id": 3,
          "first_name": "stock",
          "last_name": "keeper",
          "user_name": "sk",
          "location": "Florida"
      },
      "init_audit": {
          "audit_id": auditId,
          "initiated_on": "2021-04-08T04:15:14.444000Z",
          "last_modified_on": "2021-04-08T04:15:21.265000Z",
          "accuracy": 0,
          "status": "Pending",
          "organization": 1,
          "initiated_by": 2,
          "template_id": null,
          "inventory_items": [
              "12731370",
              "12752843"
          ],
          "assigned_sk": [
              3
          ]
      },
      "Bin": "C69",
      "item_ids": "['12731370']",
      "accuracy": 0,
      "status": "Pending"
    },
    {
      "bin_id": 12,
      "customuser": {
          "id": 3,
          "first_name": "stock",
          "last_name": "keeper",
          "user_name": "sk",
          "location": "Florida"
      },
      "init_audit": {
          "audit_id": auditId,
          "initiated_on": "2021-04-08T04:15:14.444000Z",
          "last_modified_on": "2021-04-08T04:15:21.265000Z",
          "accuracy": 0,
          "status": "Pending",
          "organization": 1,
          "initiated_by": 2,
          "template_id": null,
          "inventory_items": [
              "12731370",
              "12752843"
          ],
          "assigned_sk": [
              3
          ]
      },
      "Bin": "C20",
      "item_ids": "['12752843']",
      "accuracy": 0,
      "status": "Pending"
    }];

    service.getAssignedBins(params.get('init_audit_id')).subscribe(returnedData => {
      expect(returnedData).toEqual(returnedBins);
      for (let data of returnedData)
      {
        expect(data.init_audit.audit_id).toEqual(Number(params.get('init_audit_id')));
      }
    });

    const req = httpTestingController.expectOne(`${BASEURL}/bin-to-sk/?` + params.toString());
    expect(req.request.method).toBe("GET");
    req.flush(returnedBins);
  });

  it('should update the pre audit', () => {
    let skToAssign = 3;
    let auditId = 21;
    let binId = 15;
    let updateThisBin = {
      "bin_id": binId,
      "init_audit_id": auditId,
      "customuser": skToAssign
  };
    let returnedBin = {
      "bin_id": binId,
      "Bin": "C69",
      "item_ids": "['12731370']",
      "accuracy": 0,
      "status": "Pending",
      "init_audit": auditId,
      "customuser": skToAssign
  };

    service.updatePreAudit(binId, updateThisBin).subscribe(returnedBinn => {
      expect(returnedBinn).toEqual(returnedBin);
      expect(returnedBinn.bin_id).toEqual(updateThisBin.bin_id);
      expect(returnedBinn.init_audit).toEqual(updateThisBin.init_audit_id);
      expect(returnedBinn.customuser).toEqual(returnedBin.customuser);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/bin-to-sk/${binId}/`);
    expect(req.request.method).toBe("PATCH");
    req.flush(returnedBin);
  });

  it('should delete the pre assigned audit', () => {
    let binId = 1;
    service.deletePreAudit(binId).subscribe(returnData => {
      expect(returnData).toEqual(null);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/bin-to-sk/${binId}/`);
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });
});
