import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { AssignStockKeepersComponent } from '../components/assign-stock-keepers/assign-stock-keepers.component';
import { ManageStockKeepersDesignationComponent }
  from '../components/manage-stock-keepers-designation/manage-stock-keepers-designation.component';
import { ReviewAuditComponent } from 'src/app/components/review-audit/review-audit.component';

export interface IDeactivateComponent {
  requestConfirmation: boolean;
  deleteAudit(): void;
}

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<IDeactivateComponent> {

  canDeactivate(
    component: IDeactivateComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot):
    Observable<boolean | UrlTree> |
    Promise<boolean | UrlTree> |
    boolean |
    UrlTree {

    if (component.requestConfirmation) {
      if (confirm('Warning, there are unsaved changes. If you confirm the changes will be lost.')) {
        return (this.checkAssignStockKeepersNav(component, nextState) ||
                this.checkManageStockKeepersDesignationNav(component, nextState) ||
                this.checkReviewAuditNav(component, nextState));
      }
    }
   return !component.requestConfirmation;
  }

  checkAssignStockKeepersNav(component: IDeactivateComponent, nextState: RouterStateSnapshot): boolean {
    if (component instanceof AssignStockKeepersComponent) {
      if (nextState.url !== '/audits/assign-sk/designate-sk') {
        this.initiateAuditDiscard(component);
      }
      return true;
    }
    return false;
  }

  checkManageStockKeepersDesignationNav(component: IDeactivateComponent, nextState: RouterStateSnapshot): boolean {
    if (component instanceof ManageStockKeepersDesignationComponent) {
      if (nextState.url !== '/audits/assign-sk' &&
          nextState.url !== '/audits/assign-sk/designate-sk/review-audit') {
            this.initiateAuditDiscard(component);
      }
      return true;
    }
    return false;
  }

  checkReviewAuditNav(component: IDeactivateComponent, nextState: RouterStateSnapshot): boolean {
    if (component instanceof ReviewAuditComponent) {
      if (nextState.url !== '/audits/assign-sk/designate-sk' &&
          nextState.url !== '/audits') {
            this.initiateAuditDiscard(component);
      }
      return true;
    }
    return false;
  }

  initiateAuditDiscard(component: IDeactivateComponent) {
    component.requestConfirmation = false;
    component.deleteAudit();
  }
}
