import { browser, ExpectedConditions } from 'protractor';
import { GreetingPage } from './greeting.po';
import { OrganizationPage } from './organization.po';

/**
 * Supports Acceptance Test AT-1.3: System administrator manages organizations
 * https://github.com/Fruity-Loops/ALTA/issues/133
 */
describe('AT-1.3: System administrator manages organizations', () => {
  const newOrganizationName = 'Illuminati';
  const updatedOrganizationName = 'NWO';

  const greetingPage: GreetingPage = new GreetingPage();
  const organizationPage: OrganizationPage = new OrganizationPage();

  it('should dispaly login form', () => {
    greetingPage.navigateTo();
    expect(greetingPage.getLoginForm().isDisplayed()).toBeTruthy();
  });

  /**
   * The user should be redirected to the Manage Organizations page,
   * which displays a table containing all organizations subscribed to ALTA.
   */
  it('should login succesfully and be redirected to organization page', () => {
    greetingPage.getEmailInputField().sendKeys('system_admin@email.com');
    greetingPage.getPasswordInputField().sendKeys('password');
    greetingPage.getLoginButton().click();
    const pageAfterLogin = 'manage-organizations';
    browser.wait(ExpectedConditions.urlContains(pageAfterLogin), 5000);
    expect(organizationPage.getOrganizationTable().isDisplayed()).toBeTruthy();
  });


  /**
   * User should be able to register a new organization:
   * i) The user selects the Add button.
   * ii) The user enters the organization's name into the popup input field.
   * iii) The user submits the new organization by selecting the Create button.
   */
  it('should register a new organization', () => {
    organizationPage.getAddOrganizationButton().click();
    organizationPage.getOrganizationNameDialogueField().sendKeys(newOrganizationName);
    organizationPage.getCreateOrganizationDialogueButton().click();
    browser.wait(ExpectedConditions.visibilityOf(
      organizationPage.getOrganizationColumn(newOrganizationName)), 5000);
  });


  /**
   * Update an organization’s name:
   * i) The user selects the three vertical dots button at the end of the respective organization's row in the table.
   * ii) The user selects the Update option.
   * iii) The user enters the organization's name into the popup input field.
   * iv) The user submits the updated organization's name by selecting the Update button.
   */
  it('update an organization’s name:', () => {
    organizationPage.getCellMatMenu().click();
    organizationPage.getOrganizationMatMenuItemUpdate().click();
    const orgNameDialogueField = organizationPage.getOrganizationNameDialogueField();
    orgNameDialogueField.clear();
    orgNameDialogueField.sendKeys(updatedOrganizationName);
    organizationPage.getUpdateOrganizationDialogueButton().click();
    browser.wait(ExpectedConditions.visibilityOf(
      organizationPage.getOrganizationColumn(updatedOrganizationName)), 5000);
  });

  /**
   * Delete an organization:
   * i) The user selects the three vertical dots button at the end of the respective organization's row in the table.
   * ii) The user selects the Delete option.
   * iii) The user enters the organization's name into the popup input field to validate the deletion.
   * iv)  The user deletes the organization by selecting the Delete button.
   */
  it('update an organization’s name:', () => {
    organizationPage.getCellMatMenu().click();
    organizationPage.getOrganizationMatMenuItemDelete().click();
    const orgNameDialogueField = organizationPage.getOrganizationNameDialogueField();
    orgNameDialogueField.sendKeys(updatedOrganizationName);
    organizationPage.getDeleteOrganizationDialogueButton().click();
    browser.wait( ExpectedConditions.invisibilityOf(
      organizationPage.getOrganizationColumn(updatedOrganizationName)), 5000);
  });

});
