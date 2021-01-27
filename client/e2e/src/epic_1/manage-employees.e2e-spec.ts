import { browser, ExpectedConditions } from 'protractor';
import { Navigation } from '../navigation.po';
import { ManageMembersPage } from './manage-members.po';
import { CreateMembersPage } from './create-members.po';
import { OrganizationPage } from './organization.po';
import { SettingsPage } from './settings.po';
import { Login, Logout } from '../login.po';

/**
 * Supports Acceptance Test AT-1.4:
 * https://github.com/fruity-loops/alta/issues/33
 */
describe('AT-1.4: System administrator can create employees accounts within an organization', () => {
  const manageMembersPage: ManageMembersPage = new ManageMembersPage();
  const createMembersPage: CreateMembersPage = new CreateMembersPage();
  const organizationPage: OrganizationPage = new OrganizationPage();
  const nav: Navigation = new Navigation();
  const useableOrganization = 'test';

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
   * i) The user fills out the information in the form.
   * ii) The user hits the save button.
   * iii) The employee table is verified to have loaded.
   * iv) The table displays the changes.
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
 * Supports Acceptance Tests:
 * AT-1.5: System administrator modifies an organization's employee's account INFORMATION
 * AT-1.6: System administrator modifies an organization's employee's account STATUS
 * https://github.com/fruity-loops/alta/issues/39
 * https://github.com/fruity-loops/alta/issues/44
 */
describe('AT-1.5, 1.6: System administrator can modify an employee\'s account in an organization', () => {
  const manageMembersPage: ManageMembersPage = new ManageMembersPage();
  const settingsPage: SettingsPage = new SettingsPage();
  const organizationPage: OrganizationPage = new OrganizationPage();
  const nav: Navigation = new Navigation();

  /**
   * Login as a System Admin
   */
  beforeAll(function init(): void {
    const loginPage = new Login();
    loginPage.login_as('sa@test.com', true);
    browser.sleep(5000);
  });

  /**
   * Logout
   */
  afterAll(function endit(): void {
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
   * i) The user modifies the data in the form.
   * ii) The user selects the Save button to store the updated data.
   * iii) The information is then verified to have changed.
   */
  it('should edit user information including: status, firstname, lastname and location', () => {
    settingsPage.getEditButton().click();
    settingsPage.getFirstNameField().clear();
    settingsPage.getFirstNameField().sendKeys('a_good_first_name');
    settingsPage.getLastNameField().clear();
    settingsPage.getLastNameField().sendKeys('a_good_last_name');
    settingsPage.getLocationInputField().clear();
    settingsPage.getLocationInputField().sendKeys('New York');
    settingsPage.getStatusDropDown().click();
    settingsPage.getStatusDisabled().click();
    settingsPage.getSaveButton().click();
    settingsPage.getEditButton().click();
    expect(settingsPage.getFirstNameField().getAttribute('value')).toBe('a_good_first_name');
    expect(settingsPage.getLastNameField().getAttribute('value')).toBe('a_good_last_name');
    expect(settingsPage.getLocationInputField().getAttribute('value')).toBe('New York');
  });
});
