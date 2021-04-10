import {ModifySKAccount} from './modify-sk-account.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {CreateMembersPage} from '../epic_1/create-members.po';
import {CreateSKAccount} from './create-sk-account.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/50
 */
describe('AT-3.2: Inventory manager modifies stock-keeper\'s user information', () => {
  const nav: Navigation = new Navigation();
  const modifySK: ModifySKAccount = new ModifySKAccount();
  const createMembersPage: CreateMembersPage = new CreateMembersPage();
  const createSKAccount: CreateSKAccount = new CreateSKAccount();

  /**
   * Login as an Inventory Manager
   */
  beforeAll(function init(): void {
    const loginPage = new Login();
    loginPage.login_as('im@test.com', 'password', false);
  });

  /**
   * Logout
   */
  afterAll(function endit(): void {
    const logoutPage = new Logout();
    logoutPage.logout();
  });

  it('IM modifies SK account information', () => {
    nav.employeesOption().click();
    browser.wait(ExpectedConditions.visibilityOf(modifySK.getSettingButton()), 5000);
    modifySK.getSettingButton().click();
    browser.wait(ExpectedConditions.visibilityOf(modifySK.getEditButton()), 5000);
    modifySK.getEditButton().click();
    createMembersPage.getFirstNameField().clear();
    createMembersPage.getLastNameField().clear();
    createMembersPage.getFirstNameField().sendKeys('Hello');
    createMembersPage.getLastNameField().sendKeys('World');
    createMembersPage.getLocationField().clear();
    createMembersPage.getLocationField().sendKeys('Mtl');
    createMembersPage.getSaveButton().click();
    browser.sleep(5000);
    nav.employeesOption().click();
    browser.wait(ExpectedConditions.urlContains('modify-members'), 5000);
    browser.wait(ExpectedConditions.visibilityOf(createSKAccount.getFirstNameColumn('Hello')), 5000);
  });
});
