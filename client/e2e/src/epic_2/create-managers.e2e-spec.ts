import { Navigation } from '../epic_1/navigation.po';
import { ManageMembersPage } from '../epic_1/manage-members.po';
import { CreateMembersPage } from '../epic_1/create-members.po';
import { browser, ExpectedConditions } from 'protractor';
import { Login, Logout } from '../login.po'


/**
 * Supports Acceptance Test AT-2.1:
 * https://github.com/fruity-loops/alta/issues/42
 */
describe('AT-2.1: Inventory Manager creates an inventory manager account', () => {
  const manageMembersPage: ManageMembersPage = new ManageMembersPage();
  const createMembersPage: CreateMembersPage = new CreateMembersPage();
  const nav: Navigation = new Navigation();

  /**
   * Login as an Inventory Manager
   */
  beforeAll(function () {
    const loginPage = new Login();
    loginPage.login_as('im@test.com', false);
  });

  /**
   * Logout
   */
  afterAll(function () {
    const logoutPage = new Logout();
    logoutPage.logout();
  });

  /**
   * i) The user selects the Employees side menu option.
   * ii) The user selects the create button
   */
  it('should navigate to create members page', () => {
    nav.employeesOption().click();
    expect(manageMembersPage.getMembersTable().isDisplayed()).toBeTruthy();
    manageMembersPage.getCreateMemberButton().click();
    browser.wait(ExpectedConditions.urlContains('create-members'), 5000);
  });

  /**
   * i) The user fills out the form information
   * ii) The user submits the form
   * iii) The new IM is displayed in the table
   */
  it('should create an inventory manager member account', () => {
    const inventoryManager = {
      firstname: 'A',
      lastname: 'A',
      email: 'testIM@mail.com',
      employee_id: '1234567',
      password: 'password',
      location: 'Florida',
    };
    createMembersPage.getFirstNameField().sendKeys(inventoryManager.firstname);
    createMembersPage.getLastNameField().sendKeys(inventoryManager.lastname);
    createMembersPage.getEmailField().sendKeys(inventoryManager.email);
    createMembersPage.getEmployeeIdField().sendKeys(inventoryManager.employee_id);
    createMembersPage.getPasswordField().sendKeys(inventoryManager.password);
    createMembersPage.getRoleDropDown().click();
    createMembersPage.getRoleIM().click();
    createMembersPage.getLocationField().sendKeys(inventoryManager.location);
    createMembersPage.getSaveButton().click();
    nav.employeesOption().click();
    expect(manageMembersPage.getMembersTable().isDisplayed()).toBeTruthy();
    browser.wait(ExpectedConditions.visibilityOf(
      manageMembersPage.getFirstNameColumn(inventoryManager.firstname)), 5000);
  });
});
