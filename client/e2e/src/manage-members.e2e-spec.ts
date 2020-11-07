import { Navigation } from './navigation.po'
import { ManageMembersPage } from './manage-members.po'
import { CreateMembersPage } from './create-members.po'
import { browser, ExpectedConditions } from 'protractor';


/**
 * Supports Acceptance Test AT-1.1: System administrator creates a system administrator account
 * https://github.com/Fruity-Loops/ALTA/issues/129
 */
describe('AT-1.1: System administrator creates a system administrator account', () => {
  let manageMembersPage: ManageMembersPage = new ManageMembersPage();
  let createMembersPage: CreateMembersPage = new CreateMembersPage();
  let nav: Navigation = new Navigation(); 

  /**
   * Given that the user is logged in as a system administrator and selects the Manage Members side menu option
   */
  it('should navigate to manage members page', () => {
    nav.manageMembersOption().click();
    browser.wait(ExpectedConditions.urlContains('modify-members'), 5000);
  });

  
  /**
   * The user should be presented with a table displaying other system administrators and a Create button.
   * The user selects the Create button to display an empty form for the user to input the new user’s information
   */
  it('should navigate to create members page', () => {
    expect(manageMembersPage.getAdminMembersTable().isDisplayed()).toBeTruthy();
    manageMembersPage.getCreateMemberButton().click();
    browser.wait(ExpectedConditions.urlContains('create-members'), 5000);
  });

  /**
   * After filling the form, the user submits the data by clicking the Save button. 
   * The user is then redirected back to the table to validate the creation of the user. 
   */
  it('should create system admin member account', () => {
    const system_admin = {
      firstname :'Alex',
      lastname :'Jones',
      email : 'alex_jones@mail.com',
      employee_id: '12345678',
      password: 'password',
    }  
    createMembersPage.getFirstNameField().sendKeys(system_admin.firstname);
    createMembersPage.getLastNameField().sendKeys(system_admin.lastname);
    createMembersPage.getEmailField().sendKeys(system_admin.email);
    createMembersPage.getEmployeeIdField().sendKeys(system_admin.employee_id);
    createMembersPage.getPasswordField().sendKeys(system_admin.password);
    createMembersPage.getSaveButton().click();

    browser.wait(ExpectedConditions.urlContains('modify-members'), 5000);
    expect(manageMembersPage.getFirstNameColumn(system_admin.firstname).isDisplayed()).toBeTruthy();

  });
});
