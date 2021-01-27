import { Navigation } from '../navigation.po';
import { ManageMembersPage } from './manage-members.po';
import { CreateMembersPage } from './create-members.po';
import { browser, ExpectedConditions } from 'protractor';
import { Login, Logout } from '../login.po';


/**
 * Supports Acceptance Test AT-1.1:
 * https://github.com/fruity-loops/alta/issues/12
 */
describe('AT-1.1: System administrator creates a system administrator account', () => {
  const manageMembersPage: ManageMembersPage = new ManageMembersPage();
  const createMembersPage: CreateMembersPage = new CreateMembersPage();
  const nav: Navigation = new Navigation();

  /**
   * Login as a System Admin
   */
  beforeAll(function init(): void {
    const loginPage = new Login();
    loginPage.login_as('sa@test.com', true);
  });

  /**
   * Logout
   */
  afterAll(function endit(): void {
    const logoutPage = new Logout();
    logoutPage.logout();
  });

  /**
   * i) The user selects the Manage Members side menu option.
   * ii) The employees table is verified to have loaded.
   * iii) The user selects the create button.
   */
  it('should navigate to create members page', () => {
    nav.home().click();
    nav.manageMembersOption().click();
    browser.wait(ExpectedConditions.urlContains('modify-members'), 5000);
    expect(manageMembersPage.getMembersTable().isDisplayed()).toBeTruthy();
    manageMembersPage.getCreateMemberButton().click();
    browser.wait(ExpectedConditions.urlContains('create-members'), 5000);
  });

  /**
   * i) The user fills out the form information.
   * ii) The user submits the form.
   * iii) The employees table is verified to have loaded.
   * iv) The new SA is displayed in the table.
   */
  it('should create system admin member account', () => {
    const systemAdmin = {
      firstname: 'A',
      lastname: 'A',
      email: 'test1@mail.com',
      employee_id: '12345678',
      password: 'password',
    };
    createMembersPage.getFirstNameField().sendKeys(systemAdmin.firstname);
    createMembersPage.getLastNameField().sendKeys(systemAdmin.lastname);
    createMembersPage.getEmailField().sendKeys(systemAdmin.email);
    createMembersPage.getEmployeeIdField().sendKeys(systemAdmin.employee_id);
    createMembersPage.getPasswordField().sendKeys(systemAdmin.password);
    createMembersPage.getSaveButton().click();
    expect(manageMembersPage.getMembersTable().isDisplayed()).toBeTruthy();
    browser.wait(ExpectedConditions.visibilityOf(
      manageMembersPage.getFirstNameColumn(systemAdmin.firstname)), 5000);
  });
});
