import {ResetPassword} from './forgot-password.po';
import {Login, Logout} from '../login.po';
import {GreetingPage} from '../greeting.po';
import {browser, ExpectedConditions} from 'protractor';
import {SAModifiesInfo} from '../epic_1/sa-modifies-info.po';

/**
 * https://github.com/fruity-loops/alta/issues/198
 */
describe('AT-6.1: Reset account password', () => {
  const resetPassword: ResetPassword = new ResetPassword();
  const greetingPage: GreetingPage = new GreetingPage();
  const SAModifies: SAModifiesInfo = new SAModifiesInfo();
  const loginPage = new Login();
  const logoutPage = new Logout();

  it('User Request a New Password', () => {
    greetingPage.navigateTo();
    browser.wait(ExpectedConditions.visibilityOf(resetPassword.getForgotCredentialsButton()), 5000);
    resetPassword.getForgotCredentialsButton().click();
    browser.wait(ExpectedConditions.visibilityOf(resetPassword.getEmailField()), 5000);
    resetPassword.getEmailField().sendKeys('alta490test@mailinator.com');
    resetPassword.getSubmitButton().click();
    browser.wait(ExpectedConditions.visibilityOf(resetPassword.getCloseButton()), 5000);
    resetPassword.getCloseButton().click();
  });

  it('Navigate to email to retrieve the link', () => {
    browser.waitForAngularEnabled(false);
    browser.get('https://www.mailinator.com/v4/public/inboxes.jsp?to=alta490test');
    browser.navigate().refresh();
    browser.wait(ExpectedConditions.visibilityOf(resetPassword.getLatestEmail()), 5000);
    resetPassword.getLatestEmail().click();
    browser.wait(ExpectedConditions.visibilityOf(resetPassword.getTextButton()), 5000);
    resetPassword.getTextButton().click();
    // @ts-ignore
    browser.switchTo().frame('texthtml_msg_body');
    browser.wait(ExpectedConditions.visibilityOf(resetPassword.getResetLink()), 5000);
    resetPassword.getResetLink().click();
    browser.switchTo().defaultContent();
  });

  it('User provides new password', () => {
    // browser.wait(ExpectedConditions.urlContains('settings'), 5000);
    browser.sleep(5000);
    // browser.wait(ExpectedConditions.visibilityOf(SAModifies.getEditButton()), 5000);
    browser.refresh();
    browser.sleep(5000);
    SAModifies.getEditButton().click();
    browser.sleep(5000);
    browser.wait(ExpectedConditions.visibilityOf(SAModifies.getPasswordField()), 5000);
    SAModifies.getPasswordField().sendKeys('hello');
    SAModifies.getSaveButton().click();
    browser.sleep(5000);
    logoutPage.logout();
  });

  it('User logs in with the new password', () => {
    loginPage.login_as('alta490test@mailinator.com', 'hello', false);
    logoutPage.logout();
  });
});
