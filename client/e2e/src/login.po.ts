import { browser, ExpectedConditions } from 'protractor';
import { GreetingPage } from './greeting.po';
import { SideNav } from './side_nav.po';

export class Login{
    greetingPage: GreetingPage = new GreetingPage();

    login_as(email: string, isAdmin: boolean): void {
        this.greetingPage.navigateTo();
        this.greetingPage.getEmailInputField().sendKeys(email);
        this.greetingPage.getPasswordInputField().sendKeys('password');
        this.greetingPage.getLoginButton().click();
        let pageAfterLogin;
        if (isAdmin)
        {
            pageAfterLogin = 'manage-organizations';
        }
        else
        {
            pageAfterLogin = 'dashboard';
        }
        browser.wait(ExpectedConditions.urlContains(pageAfterLogin), 5000);
    }
}

export class Logout{
    sideNav: SideNav = new SideNav();

    logout(): void {
        this.sideNav.getLogoutOption().click();
        browser.waitForAngular();
        this.sideNav.getLogoutButton().click();
        const pageAfterLogout = 'login';
        browser.wait(ExpectedConditions.urlContains(pageAfterLogout), 5000);
    }
}
