import {SAModifiesInfo} from './sa-modifies-info.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/43
 */
describe('AT-1.2: System administrator modifies their account information', () => {
  const nav: Navigation = new Navigation();
  const SAModifies: SAModifiesInfo = new SAModifiesInfo();
  const loginPage = new Login();
  const logoutPage = new Logout();

  it('SA Changes their First Name, Last Name, and Password', () => {
    loginPage.login_as('sa@test.com', 'password', true);
    nav.settingsOption().click();
    browser.wait(ExpectedConditions.visibilityOf(SAModifies.getEditButton()), 5000);
    SAModifies.getEditButton().click();
    browser.wait(ExpectedConditions.visibilityOf(SAModifies.getFirstNameField()), 5000);
    SAModifies.getFirstNameField().clear();
    SAModifies.getFirstNameField().sendKeys('SAFirstName');
    SAModifies.getLastNameField().clear();
    SAModifies.getLastNameField().sendKeys('SALastName');
    browser.wait(ExpectedConditions.visibilityOf(SAModifies.getPasswordField()), 5000);
    SAModifies.getPasswordField().sendKeys('hello');
    SAModifies.getSaveButton().click();
    browser.sleep(5000);
    logoutPage.logout();
  });

  it('SA Logins with the new password', () => {
    loginPage.login_as('sa@test.com', 'hello', true);
    logoutPage.logout();
  });

});
