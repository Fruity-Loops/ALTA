import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/authentication/auth.service';
import { TokenService } from '../services/authentication/token.service';
import { ManageMembersService } from '../services/users/manage-members.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private memberService: ManageMembersService,
    private authService: AuthService
  ) {}
  user: any;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token_from_param = next.queryParams['token'];
    const target_url = state.url.split('?')[0];

    // we use a promise because we need the info of user to be populated before navigating to the route
    return new Promise((resolve, reject) => {
      if (token_from_param) {
        this.tokenService.SetToken(token_from_param);
        this.memberService.getUserFromToken().subscribe((data) => {
          this.user = data;
          this.authService.setNext(
            data.user_id,
            data.user,
            data.role,
            data.organization_id,
            data.organization_name
          );
          console.log('from ininside');
          if (data.role === 'SA') {
            this.authService.turnOffOrgMode();
          } else {
            this.authService.turnOnOrgMode(
              { organization: data.organization_id, ...data },
              true
            );
          }
          const token = this.tokenService.GetToken();
          const isAllowed = this.getGuard(token);
          if (isAllowed) {
            this.router.navigate([target_url]);
          }
        });
      } else {
        const token = this.tokenService.GetToken();
        resolve(this.getGuard(token));
      }
    });
  }

  getGuard(token: any) {
    if (token) {
      console.log(token);
      return true;
    } else {
      console.log('here');
      this.router.navigate(['login']); // If no token exist redirect user to login/register page
      return false;
    }
  }
}
