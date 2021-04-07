import {AuditAssigned} from './create-sk-account.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/49
 */
describe('AT-3.1: Inventory manager creates stock-keeper account', () => {
  const nav: Navigation = new Navigation();
  const createSK: AuditAssigned = new AuditAssigned();

  /**
   * Login as an Inventory Manager
   */
  beforeAll(function init(): void {
    const loginPage = new Login();
    loginPage.login_as('im@test.com', false);
  });

  /**
   * Logout
   */
  afterAll(function endit(): void {
    const logoutPage = new Logout();
    logoutPage.logout();
  });

  it('IM creates SK account', () => {
    nav.employeesOption().click();
    browser.wait(ExpectedConditions.visibilityOf(createSK.getCreateButton()), 5000);
    createSK.getCreateButton().click();
    browser.wait(ExpectedConditions.visibilityOf(createSK.getFirstName()), 5000);
    createSK.getFirstName().sendKeys('FN Test');
    createSK.getLastName().sendKeys('LN Test');
    createSK.getPassword().sendKeys('password');
    createSK.getRole().click();
    createSK.getRoleOption().click();
    createSK.getEmail().sendKeys('sk911@test.com');
    createSK.getEmployeeID().sendKeys('123456789');
    createSK.getEmployeeLocation().sendKeys('Montreal');
    createSK.getSaveButton().click();
    browser.wait(ExpectedConditions.urlContains('modify-members'), 5000);
    browser.wait(ExpectedConditions.visibilityOf(createSK.getFirstNameColumn('FN Test')), 5000);
  });
});
