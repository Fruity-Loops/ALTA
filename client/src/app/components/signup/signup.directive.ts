import { Directive, ElementRef } from '@angular/core';
import { AuthService } from "src/app/services/auth.service";

@Directive({
  selector: '[appSignup]',
})
export class SignupDirective {
  loggedInUserRole;

  constructor(private elementRef: ElementRef, private authService: AuthService) {
    const accessControls: any = this.authService.getCurrentRole()
      .subscribe((data) => {
        this.loggedInUserRole = data;
        //Hides elements that are intended for SA roles
        if(this.loggedInUserRole != 'SA') {
          this.elementRef.nativeElement.style.display = "none";
        }
      });
  }
}
