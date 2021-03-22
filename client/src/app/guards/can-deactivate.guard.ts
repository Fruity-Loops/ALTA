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
  isDirty: boolean;
  deleteAudit(): void;
  // canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
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

    if (component.isDirty) {
      if (confirm('Warning, there are unsaved changes. If you confirm the changes will be lost.')) {

        if (component instanceof AssignStockKeepersComponent) {
          if (nextState.url !== '/audits/assign-sk/designate-sk') {
            this.initiateAuditDiscard(component);
          }
        }

        if (component instanceof ManageStockKeepersDesignationComponent) {
          if (nextState.url !== '/audits/assign-sk' &&
              nextState.url !== '/audits/assign-sk/designate-sk/review-audit') {
            this.initiateAuditDiscard(component);
          }
        }

        if (component instanceof ReviewAuditComponent) {
          if (nextState.url !== '/audits/assign-sk/designate-sk' &&
              nextState.url !== '/audits') {
            this.initiateAuditDiscard(component);
          }
        }
        console.log("should be the end")
        return true;
      }
    }
    console.log("still getting called!")
   return !component.isDirty;
  }

  initiateAuditDiscard(component: IDeactivateComponent) {
    component.isDirty = false;
    component.deleteAudit();
  }
}
