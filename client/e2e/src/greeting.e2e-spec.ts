import { env } from '../../src/environments/environment';
import { GreetingPage } from './greeting.po';
import { browser, ExpectedConditions } from 'protractor';

describe('E2E Greeting Page', () => {
  let page: GreetingPage;

  beforeEach(() => {
    page = new GreetingPage();
  });

  it('should render login form', () => {
    page.navigateTo();
    expect(page.getLoginForm()).toBeTruthy();
  });


  it('should login succesfully to organization page', () => {
    page.navigateTo();
    page.getEmailInputField().sendKeys('system_admin@email.com');
    page.getPasswordInputField().sendKeys('password');
    page.getLoginButton().click();
    const pageAfterLogin = 'manage-organizations';
    browser.wait(ExpectedConditions.urlContains(pageAfterLogin), 5000);
  });
});
