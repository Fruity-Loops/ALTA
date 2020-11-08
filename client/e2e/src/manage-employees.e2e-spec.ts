import { browser, ExpectedConditions } from 'protractor';
import { Navigation } from './navigation.po';
import { ManageMembersPage } from './manage-members.po';
import { CreateMembersPage } from './create-members.po';
import { OrganizationPage } from './organization.po';
import { SettingsPage } from './settings.po';


/**
 * Supports Acceptance Test AT-1.4: System administrator create organization's employee's accounts
 * https://github.com/Fruity-Loops/ALTA/issues/134
 */
describe('AT-1.4: System administrator create organizations employees accounts', () => {
  const manageMembersPage: ManageMembersPage = new ManageMembersPage();
  const createMembersPage: CreateMembersPage = new CreateMembersPage();
  const organizationPage: OrganizationPage = new OrganizationPage();
  const nav: Navigation = new Navigation();
  const newOrganizationName = 'TheWire';

  /**
   * Given that the user is logged in as a system administrator and is viewing the Manage Organizations page
   */
  it('should navigate to manage organizations page', () => {
    nav.home().click();
    nav.manageOrganizationOption().click();
    browser.wait(ExpectedConditions.urlContains('manage-organizations'), 5000);
  });


  /**
   * The user is able to select an organization by clicking on its respective row in the presented table.
   */
  it('should go to a new organizations page', () => {
    organizationPage.getAddOrganizationButton().click();
    organizationPage.getOrganizationNameDialogueField().sendKeys(newOrganizationName);
    organizationPage.getCreateOrganizationDialogueButton().click();
    browser.wait(ExpectedConditions.visibilityOf(
      organizationPage.getOrganizationColumn(newOrganizationName)), 5000);
    organizationPage.getOrganizationColumn(newOrganizationName).click();
  });

  /**
   *
   * The user selects the Employees side menu option.
   * The user is presented with a table displaying the affiliated employee user accounts and a Create button.
   */
  it('should go organization employee page ', () => {
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
    };
    createMembersPage.getFirstNameField().sendKeys(employee.firstname);
    createMembersPage.getLastNameField().sendKeys(employee.lastname);
    createMembersPage.getEmailField().sendKeys(employee.email);
    createMembersPage.getEmployeeIdField().sendKeys(employee.employee_id);
    createMembersPage.getPasswordField().sendKeys(employee.password);
    createMembersPage.getRoleDropDown().click();
    createMembersPage.getRoleIM().click();
    createMembersPage.getSaveButton().click();

    browser.wait(ExpectedConditions.urlContains('modify-members'), 5000);
    browser.wait(ExpectedConditions.visibilityOf(
      manageMembersPage.getFirstNameColumn(employee.firstname)), 5000);
  });
});


/**
 *
 * Supports Acceptance Tests:
 *  AT-1.5: System administrator modifies an organization's employee's account INFORMATION
 *  AT-1.6: System administrator modifies an organization's employee's account STATUS
 * https://github.com/Fruity-Loops/ALTA/issues/135
 * https://github.com/Fruity-Loops/ALTA/issues/136
 *
 */
describe('AT-1.5, 1.6: System administrator modifies an organizations employees account', () => {
  const manageMembersPage: ManageMembersPage = new ManageMembersPage();
  const settingsPage: SettingsPage = new SettingsPage();

  /**
   * The user selects the grey dot button at the end of the respective employee's row
   * to present the form containing the employee's account information.
   */
  it('should navigate to modify employee settings', () => {
    manageMembersPage.getEmplopyeeSettingsButton().click();
    browser.wait(ExpectedConditions.urlContains('modify-members'), 5000);
  });

  /**
   * The user selects the Edit button to allow the fields to accept input.
   * The user is able to alter the employee account's information and status to "active" or "disabled".
   * Once the information is modified, the user selects the Save button to store the updated data.
   * The form is then refreshed to display the updated information
   * TODO: COMPARE PREVIOUS AND NEW DATA
   */
  it('should edit user information including status', () => {
    settingsPage.getEditSaveButton().click();
    settingsPage.getEmailInputField().clear();
    settingsPage.getEmailInputField().sendKeys('new_employee_email@email.com');
    settingsPage.getPasswordInputField().clear();
    settingsPage.getPasswordInputField().sendKeys('new_employee_pass');
    settingsPage.getRoleDropDown().click();
    settingsPage.getRoleSK().click();
    settingsPage.getStatusDropDown().click();
    settingsPage.getRoleInactive().click();
    settingsPage.getEditSaveButton().click();
    browser.wait(ExpectedConditions.urlContains('modify-members'), 5000);
  });
});
