import {browser, ExpectedConditions, protractor} from 'protractor';
import {GreetingPage} from './greeting.po';

export class Login {
    greetingPage: GreetingPage = new GreetingPage();

    login_as(email: string): void {
        this.greetingPage.navigateTo();
        this.greetingPage.getEmailInputField().sendKeys(email);
        expect(this.greetingPage.getEmailInputField().getAttribute('value')).toBe(email);
        this.greetingPage.getSendPinButton().click();
        browser.wait(ExpectedConditions.urlContains('login'), 5000);
        this.greetingPage.getPasswordInputField().sendKeys('password');
        expect(this.greetingPage.getPasswordInputField().getAttribute('value')).toBe('password');
        this.greetingPage.getLoginButton().click();
        browser.wait(ExpectedConditions.urlContains('audits'), 5000);
    }
}

export class Logout {
    greetingPage: GreetingPage = new GreetingPage();

    logout(): void {
        browser.wait(ExpectedConditions.visibilityOf(this.greetingPage.getProfileButton()), 5000);
        this.greetingPage.getProfileButton().click();
        browser.wait(ExpectedConditions.visibilityOf(this.greetingPage.getlogoutButton()), 5000);
        this.greetingPage.getlogoutButton().click();
        browser.wait(ExpectedConditions.urlContains('signin'), 5000);
    }
}
