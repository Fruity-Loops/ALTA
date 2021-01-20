import { browser, ExpectedConditions } from 'protractor';
import { Navigation } from '../navigation.po';
import { ManageMembersPage } from './manage-members.po';
import { CreateMembersPage } from './create-members.po';
import { OrganizationPage } from './organization.po';
import { SettingsPage } from './settings.po';
import { Login, Logout } from '../login.po'

/**
 * Supports Acceptance Test AT-1.4:
 * https://github.com/fruity-loops/alta/issues/33
 */
describe('AT-1.4: System administrator create organizations employees accounts', () => {
  const manageMembersPage: ManageMembersPage = new ManageMembersPage();
  const createMembersPage: CreateMembersPage = new CreateMembersPage();
  const organizationPage: OrganizationPage = new OrganizationPage();
  const nav: Navigation = new Navigation();
  const useableOrganization = 'test';

  /**
   * Login as a System Admin
   */
  beforeAll(function () {
    const loginPage = new Login();
    loginPage.login_as('sa@test.com', true);
  });

  /**
   * Logout
   */
  afterAll(function () {
    const logoutPage = new Logout();
    logoutPage.logout();
  });

  /**
   * i) Click on the test organization.
   * ii) Verify the table loads.
   * iii) Click on create-members.
   */
  it('should go to the test organization\'s create employee page ', () => {
    nav.manageOrganizationOption().click();
    organizationPage.getOrganizationNameColumn('test').click();
    nav.employeesOption().click();
    expect(manageMembersPage.getMembersTable().isDisplayed()).toBeTruthy();
    manageMembersPage.getCreateMemberButton().click();
    browser.wait(ExpectedConditions.urlContains('create-members'), 5000);
  });

  /**
   * After filling the form, the user submits the data by clicking the Save button.
   * The user is then redirected back to the table to validate the creation of the user.
   */
  it('should create an employee account', () => {
    const employee = {
      firstname: 'Dwayne',
      lastname: 'Johnson',
      email: 'the_rock@email.com',
      employee_id: '422112',
      password: 'password',
      location: 'Florida',
    };
    createMembersPage.getFirstNameField().sendKeys(employee.firstname);
    createMembersPage.getLastNameField().sendKeys(employee.lastname);
    createMembersPage.getEmailField().sendKeys(employee.email);
    createMembersPage.getEmployeeIdField().sendKeys(employee.employee_id);
    createMembersPage.getPasswordField().sendKeys(employee.password);
    createMembersPage.getRoleDropDown().click();
    createMembersPage.getRoleIM().click();
    createMembersPage.getLocationField().sendKeys(employee.location);
    createMembersPage.getSaveButton().click();

    browser.wait(ExpectedConditions.urlContains('modify-members'), 5000);
    browser.wait(ExpectedConditions.visibilityOf(
      manageMembersPage.getFirstNameColumn(employee.firstname)), 5000);
  });
});


/**
 *
 * Supports Acceptance Tests:
 * AT-1.5: System administrator modifies an organization's employee's account INFORMATION
 * AT-1.6: System administrator modifies an organization's employee's account STATUS
 * https://github.com/fruity-loops/alta/issues/39
 * https://github.com/fruity-loops/alta/issues/44
 *
 */
describe('AT-1.5, 1.6: System administrator modifies an organizations employees account', () => {
  const manageMembersPage: ManageMembersPage = new ManageMembersPage();
  const settingsPage: SettingsPage = new SettingsPage();
  const organizationPage: OrganizationPage = new OrganizationPage();
  const nav: Navigation = new Navigation();

  /**
   * Login as a System Admin
   */
  beforeAll(function () {
    const loginPage = new Login();
    loginPage.login_as('sa@test.com', true);
  });

  /**
   * Logout
   */
  afterAll(function () {
    const logoutPage = new Logout();
    logoutPage.logout();
  });

  /**
   * i) The user clicks on the test organization.
   * ii) The employees table is verified to have loaded.
   * iii) The user clicks on an Employee's settings.
   */
  it('should go to the test organization\'s create employee page ', () => {
    nav.manageOrganizationOption().click();
    organizationPage.getOrganizationNameColumn('test').click();
    nav.employeesOption().click();
    expect(manageMembersPage.getMembersTable().isDisplayed()).toBeTruthy();
    manageMembersPage.getEmployeeSettings('stock', 'keeper').click();
    browser.wait(ExpectedConditions.urlContains('modify-members'), 5000);
  });

  /**
   * i) The user selects the test organization.
   * ii) The user selects an employee's settings.
   * iii) The user is able to alter the employee's status, firstname, lastname and location.
   * iv) The user selects the Save button to store the updated data.
   * v) The data in the table displays the changes.
   */
  it('should edit user information including: status, firstname, lastname and location', () => {
    settingsPage.getEditButton().click();
    settingsPage.getFirstNameField().sendKeys('a_good_first_name');
    settingsPage.getFirstNameField().sendKeys('a_good_last_name');
    settingsPage.getLocationInputField().sendKeys('New York');
    settingsPage.getStatusDropDown().click();
    settingsPage.getStatusDisabled().click();
    settingsPage.getSaveButton().click();
    browser.wait(ExpectedConditions.urlContains('modify-members'), 5000);
    nav.employeesOption().click();
    expect(manageMembersPage.getMembersTable().isDisplayed()).toBeTruthy();
    browser.wait(ExpectedConditions.visibilityOf(
      manageMembersPage.getFirstNameColumn('a_good_first_name')), 5000);
  });
});
