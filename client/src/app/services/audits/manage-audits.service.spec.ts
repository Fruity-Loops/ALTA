import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ManageAuditsService, AuditLocalStorage } from './manage-audits.service';
import { env } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { ManageAuditsSpecVariables } from './manage-audits-spec-variables';

describe('ManageAuditsService', () => {
  const BASEURL = env.api_root;
  let service: ManageAuditsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ManageAuditsService
      ],
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ManageAuditsService);
  });

  afterEach(() => {
    // Used to make sure there are no subscribe requests leftover
    httpTestingController.verify();
    ManageAuditsSpecVariables.mockLocalStorage.clear();
    httpTestingController = null;
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(httpTestingController).toBeTruthy();
  });

  it('should store the audit id in localStorage',
    () => {
      spyOn(localStorage, 'setItem').and.callFake(ManageAuditsSpecVariables.mockLocalStorage.setItem);
      spyOn(localStorage, 'getItem').and.callFake(ManageAuditsSpecVariables.mockLocalStorage.getItem);
      service.updateLocalStorage(AuditLocalStorage.AuditId, '4');
      expect(localStorage.getItem(AuditLocalStorage.AuditId)).toBe('4');
  });
  
  it('should return the audit id from localStorage',
    () => {
      spyOn(localStorage, 'setItem').and.callFake(ManageAuditsSpecVariables.mockLocalStorage.setItem);
      spyOn(localStorage, 'getItem').and.callFake(ManageAuditsSpecVariables.mockLocalStorage.getItem);
      localStorage.setItem(AuditLocalStorage.AuditId, '4');
      expect(service.getLocalStorage(AuditLocalStorage.AuditId)).toBe('4');
  });

  it('should delete the audit id from localStorage',
    () => {
      spyOn(localStorage, 'setItem').and.callFake(ManageAuditsSpecVariables.mockLocalStorage.setItem);
      spyOn(localStorage, 'removeItem').and.callFake(ManageAuditsSpecVariables.mockLocalStorage.removeItem);
      localStorage.setItem(AuditLocalStorage.AuditId, '6');
      service.removeFromLocalStorage(AuditLocalStorage.AuditId);
      expect(localStorage.removeItem).toHaveBeenCalledWith(AuditLocalStorage.AuditId);
      expect(localStorage.getItem(AuditLocalStorage.AuditId)).toBe(null);
  });
  

  it('should create an audit', () => {
    const auditCreationInfo = {
      initiated_by: 2,
      inventory_items: ["12752843", "12731370"],
      organization: 1
    };

    service.createAudit(auditCreationInfo).subscribe(audit => {
      expect(audit).toEqual(ManageAuditsSpecVariables.auditReturnInfo);
      expect(audit.initiated_by).toEqual(auditCreationInfo.initiated_by);
      expect(audit.inventory_items).toEqual(auditCreationInfo.inventory_items);
      expect(audit.organization).toEqual(auditCreationInfo.organization);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/`);
    expect(req.request.method).toBe("POST");
    req.flush(ManageAuditsSpecVariables.auditReturnInfo);
  });

  it('should delete the audit', () => {
    let auditId = 1;
    service.deleteAudit(auditId).subscribe(audit => {
      expect(audit).toEqual(null);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/${auditId}/`);
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });

  it('should update the audit', () => {
    let skToAssign = 1;
    let auditId = 1;
    let bodyAssignedSK = {assigned_sk: [skToAssign]};

    service.assignSK(bodyAssignedSK, auditId).subscribe(audit => {
      expect(audit).toEqual(ManageAuditsSpecVariables.edittedAudit);
      expect(audit.assigned_sk).toEqual(bodyAssignedSK.assigned_sk);
      expect(audit.audit_id).toEqual(auditId);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/${auditId}/`);
    expect(req.request.method).toBe("PATCH");
    req.flush(ManageAuditsSpecVariables.edittedAudit);
  });

  it('should assign the SK to the audit', () => {
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

  it('should return the audit', () => {
    let auditId = 1;
    service.getAuditData(auditId).subscribe(audit => {
      expect(audit).toEqual(ManageAuditsSpecVariables.auditReturnInfo);
      expect(audit.audit_id).toEqual(auditId);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/${auditId}/`);
    expect(req.request.method).toBe("GET");
    req.flush(ManageAuditsSpecVariables.auditReturnInfo);
  });

  it('should return the active SKs', () => {
    let auditId = 1;
    let params = {organization: '1', status: 'Active', no_pagination: 'True'}

    service.getAuditData(auditId).subscribe(audits => {
      expect(audits).toEqual(ManageAuditsSpecVariables.auditListing);
      for (let audit of audits)
      {
        expect(audit.status).toEqual(params.status);
        expect(audit.organization).toEqual(Number(params.organization))
      }
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/${auditId}/`);
    expect(req.request.method).toBe("GET");
    req.flush(ManageAuditsSpecVariables.auditListing);
  });

  it('should return the audits properly formatted', () => {
    let orgId = 1;
    let params = new HttpParams();
    let pageIndex = 1;
    let pageSize = 25;
    params = params.append('page', String(pageIndex));
    params = params.append('page_size', String(pageSize));
    params = params.append('organization', String(orgId));
    params = params.append('status', 'Active');

    service.getProperAudits(params).subscribe(audits => {
      expect(audits).toEqual(ManageAuditsSpecVariables.formattedAudits);
      for (let audit of audits)
      {
        expect(audit.status).toEqual(params.get('status'));
      }
    });

    const req = httpTestingController.expectOne(`${BASEURL}/audit/proper_audits/?`+ params.toString());
    expect(req.request.method).toBe("GET");
    req.flush(ManageAuditsSpecVariables.formattedAudits);
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

    service.initiatePreAudit(searchForThisBin).subscribe(returnedBinn => {
      expect(returnedBinn).toEqual(ManageAuditsSpecVariables.returnableBin);
      expect(returnedBinn.init_audit).toEqual(ManageAuditsSpecVariables.returnableBin.init_audit);
      expect(returnedBinn.customuser).toEqual(ManageAuditsSpecVariables.returnableBin.customuser);
      expect(returnedBinn.item_ids).toEqual(`['${searchForThisBin.item_ids}']`);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/bin-to-sk/`);
    expect(req.request.method).toBe("POST");
    req.flush(ManageAuditsSpecVariables.returnableBin);
  });

  it('should get the pre assigned audit', () => {
    let auditId = 1;
    let params = new HttpParams();
    params = params.append('init_audit_id', String(auditId));

    service.getAssignedBins(params.get('init_audit_id')).subscribe(returnedData => {
      expect(returnedData).toEqual(ManageAuditsSpecVariables.returnedBins);
      for (let data of returnedData)
      {
        expect(data.init_audit.audit_id).toEqual(Number(params.get('init_audit_id')));
      }
    });

    const req = httpTestingController.expectOne(`${BASEURL}/bin-to-sk/?` + params.toString());
    expect(req.request.method).toBe("GET");
    req.flush(ManageAuditsSpecVariables.returnedBins);
  });

  it('should update the pre audit', () => {
    let skToAssign = 4;
    let auditId = 21;
    let binId = 1;
    let updateThisBin = {
      "bin_id": binId,
      "init_audit_id": auditId,
      "customuser": skToAssign
    };

    service.updatePreAudit(binId, updateThisBin).subscribe(returnedBinn => {
      expect(returnedBinn).toEqual(ManageAuditsSpecVariables.updatedBin);
      expect(returnedBinn.bin_id).toEqual(updateThisBin.bin_id);
      expect(returnedBinn.init_audit).toEqual(updateThisBin.init_audit_id);
      expect(returnedBinn.customuser).toEqual(ManageAuditsSpecVariables.updatedBin.customuser);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/bin-to-sk/${binId}/`);
    expect(req.request.method).toBe("PATCH");
    req.flush(ManageAuditsSpecVariables.updatedBin);
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
