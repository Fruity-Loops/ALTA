import { flush, TestBed } from '@angular/core/testing';
import { ManageMembersService } from './manage-members.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService, UserLocalStorage } from 'src/app/services/authentication/auth.service';
import { env } from 'src/environments/environment';
import { ManageMemberSpecVariables } from './manage-members-spec-variables';
import { BehaviorSubject, EMPTY, throwError } from 'rxjs';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

describe('ManageMembersService', () => {
  const BASEURL = env.api_root;
  let httpTestingController: HttpTestingController;
  let memberService: ManageMembersService;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageMembersService, AuthService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    memberService = TestBed.inject(ManageMembersService);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    // Used to make sure there are no subscribe requests leftover
    httpTestingController.verify();
    httpTestingController = null;
    memberService = null;
    authService = null;
  });

  it('should be created', () => {
    expect(memberService).toBeTruthy();
    expect(authService).toBeTruthy();
    expect(httpTestingController).toBeTruthy();
  });

  it('should get the organization\'s ID', () => {
    let orgId = '1';
    let spy = spyOn(authService, 'getLocalStorage').and.returnValue(orgId);
    expect(memberService.getOrgId()).toEqual(orgId);
    expect(authService.getLocalStorage).toHaveBeenCalledWith(UserLocalStorage.OrgId);
    orgId = '';
    spy.and.returnValue(orgId);
    expect(memberService.getOrgId()).toEqual(orgId);
  });

  it('should get clients', () => {
    let orgId = '1';
    let errorMessage = 'Forbidden';
    let statusNumber = 403;
    let orgModeOn = new BehaviorSubject(true);
    let params = new HttpParams();
    params = params.append('organization', String(orgId));
    params = params.append('no_pagination', 'True');

    let orgModeSpy = spyOn(authService, 'getOrgMode').and.returnValue(orgModeOn);
    spyOn(memberService, 'getOrgId').and.returnValue(orgId);

    memberService.getAllClients().subscribe((data) => {
      expect(data).toEqual(ManageMemberSpecVariables.employees);
    });
    orgModeOn.next(false);
    orgModeSpy.and.returnValue(orgModeOn);
    memberService.getAllClients().subscribe((data) => {
      expect(data).toEqual(ManageMemberSpecVariables.accessedClients);
    });
    memberService.getAllClients().subscribe((data) => {
      expect(data).toEqual(EMPTY);
    },
    // If error propogated
    (error) => {
      expect(error.status).toEqual(statusNumber);
      expect(error.statusText).toEqual(errorMessage);
    });

    expect(authService.getOrgMode).toHaveBeenCalledWith();
    const req = httpTestingController.expectOne(`${BASEURL}/user/?` + params.toString());
    expect(req.request.method).toBe("GET");
    req.flush(ManageMemberSpecVariables.employees);
    
    const req2 = httpTestingController.match(`${BASEURL}/accessClients/`);
    expect(req2[0].request.method).toBe("GET");
    req2[0].flush(ManageMemberSpecVariables.accessedClients);

    expect(req2[1].request.method).toBe("GET");
    req2[1].flush('403 error', { status: statusNumber, statusText: errorMessage });
  });

  it('should get paginated clients', () => {
    let orgId = '1';
    let errorMessage = 'Forbidden';
    let statusNumber = 403;
    let orgModeOn = new BehaviorSubject(true);
    let params = new HttpParams();
    params = params.append('organization', String(orgId));

    let orgModeSpy = spyOn(authService, 'getOrgMode').and.returnValue(orgModeOn);
    spyOn(memberService, 'getOrgId').and.returnValue(orgId);

    memberService.getPaginatedClients(params).subscribe((data) => {
      expect(data).toEqual(ManageMemberSpecVariables.employees);
    });
    orgModeOn.next(false);
    orgModeSpy.and.returnValue(orgModeOn);
    memberService.getPaginatedClients(params).subscribe((data) => {
      expect(data).toEqual(ManageMemberSpecVariables.accessedClients);
    });

    memberService.getPaginatedClients(params).subscribe((data) => {
      expect(data).toEqual(EMPTY);
    },
    // If error propogated
    (error) => {
      expect(error.status).toEqual(statusNumber);
      expect(error.statusText).toEqual(errorMessage);
    });

    expect(authService.getOrgMode).toHaveBeenCalledWith();
    const req = httpTestingController.expectOne(`${BASEURL}/user/?` + params.toString() + '&' + params.toString());
    expect(req.request.method).toBe("GET");
    req.flush(ManageMemberSpecVariables.employees);

    const req2 = httpTestingController.match(`${BASEURL}/accessPagedClients/?` + params.toString());
    expect(req2[0].request.method).toBe("GET");
    req2[0].flush(ManageMemberSpecVariables.accessedClients);

    expect(req2[1].request.method).toBe("GET");
    req2[1].flush('403 error', { status: statusNumber, statusText: errorMessage });
  });

  it('should update user password', () => {
    let userId = '1';
    let updateInfo = {password: 'a good password'};
    memberService.updatePassword(updateInfo, userId).subscribe(data => {
      expect(data).toEqual(updateInfo);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/user/${userId}/`);
    expect(req.request.method).toBe("PATCH");
    req.flush(ManageMemberSpecVariables.updatedPassword);
  });

  it('should update user info', () => {
    let userId = '1';
    let updateInfo = {first_name: 'a good name', last_name: "admin"};
    memberService.updateClientInfo(updateInfo, userId).subscribe(data => {
      expect(data).toEqual(updateInfo);
    });

    const req = httpTestingController.expectOne(`${BASEURL}/user/${userId}/`);
    expect(req.request.method).toBe("PATCH");
    req.flush(ManageMemberSpecVariables.updatedEmployee);
  });

  it('should get the current user', () => {
    let userId = '7';
    let updateInfo = {first_name: 'a good name', last_name: "admin"};
    memberService.getEmployee(userId).subscribe(data => {
      expect(data.id).toEqual(Number(userId));
    });

    const req = httpTestingController.expectOne(`${BASEURL}/user/${userId}/`);
    expect(req.request.method).toBe("GET");
    req.flush(ManageMemberSpecVariables.employees[0]);
  });
});
