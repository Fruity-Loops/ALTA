import {CreateSKAccount} from './create-sk-account.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {CreateMembersPage} from '../epic_1/create-members.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/49
 */
describe('AT-3.1: Inventory manager creates stock-keeper account', () => {
  const nav: Navigation = new Navigation();
  const createSK: CreateSKAccount = new CreateSKAccount();
  const createMembersPage: CreateMembersPage = new CreateMembersPage();

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
    browser.wait(ExpectedConditions.visibilityOf(createMembersPage.getFirstNameField()), 5000);
    createMembersPage.getFirstNameField().sendKeys('FN Test');
    createMembersPage.getLastNameField().sendKeys('LN Test');
    createMembersPage.getPasswordField().sendKeys('password');
    createMembersPage.getRoleDropDown().click();
    createSK.getRoleOption().click();
    createMembersPage.getEmailField().sendKeys('sk9110@test.com');
    createMembersPage.getEmployeeIdField().sendKeys('12345678');
    createMembersPage.getLocationField().sendKeys('Montreal');
    createMembersPage.getSaveButton().click();
    browser.wait(ExpectedConditions.urlContains('modify-members'), 5000);
    browser.wait(ExpectedConditions.visibilityOf(createSK.getFirstNameColumn('FN Test')), 5000);
  });
});
