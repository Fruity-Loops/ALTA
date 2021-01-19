import { browser, ExpectedConditions } from 'protractor';
import { OrganizationPage } from './organization.po';
import { Login, Logout } from '../login.po'

/**
 * Supports Acceptance Test AT-1.3:
 * https://github.com/fruity-loops/alta/issues/71
 */
describe('AT-1.3: System administrator manages organizations', () => {
  const newOrganizationName = 'new_org';
  const updatedOrganizationName = 'updated_org';
  const location = 'Florida'
  const organizationPage: OrganizationPage = new OrganizationPage();

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
    logoutPage.logout()
  });


  /**
   * i) The user selects the Add button.
   * ii) The user enters the organization's name and location into the popup input fields.
   * iii) The user submits the new organization by selecting the Save button.
   * iv) The table displays the changes.
   */
  it('should register a new organization', () => {
    organizationPage.getAddOrganizationButton().click();
    organizationPage.getOrganizationNameDialogueField().sendKeys(newOrganizationName);
    organizationPage.getOrganizationLocationDialogueField().sendKeys(location);
    organizationPage.getSaveOrganizationButton().click();
    expect(organizationPage.getOrganizationTable().isDisplayed()).toBeTruthy();
    browser.wait(ExpectedConditions.visibilityOf(
      organizationPage.getOrganizationNameColumn(newOrganizationName)), 5000);
  });


  /**
   * i) The user selects the dot button at the end of the respective organization's row in the table.
   * ii) The user selects the Edit option.
   * iii) The user enters the organization's name and in the input field.
   * iv) The user submits the updated info by selecting the Save button.
   * v) The table displays the changes.
   */
  it('should update the created organization’s name', () => {
    organizationPage.getOrgSettings(newOrganizationName).click();
    organizationPage.getOrgEditButton().click();
    const orgNameDialogueField = organizationPage.getOrganizationNameDialogueField();
    orgNameDialogueField.clear();
    orgNameDialogueField.sendKeys(updatedOrganizationName);
    organizationPage.getSaveOrganizationButton().click();
    organizationPage.navigateTo();
    expect(organizationPage.getOrganizationTable().isDisplayed()).toBeTruthy();
    browser.wait(ExpectedConditions.visibilityOf(
      organizationPage.getOrganizationNameColumn(updatedOrganizationName)), 5000);
  });

  /**
   * i) The user selects the dot button at the end of the respective organization's row in the table.
   * ii) The user selects the Edit option.
   * iii) The user clicks on the status drop down.
   * iv) The user selects the Disabled option.
   * v) The user enters in the name of the organization and confirms.
   * vi) The table displays the changes.
   */
  it('should disable the organization', () => {
    organizationPage.getOrgSettings(updatedOrganizationName).click();
    organizationPage.getOrgEditButton().click();
    const orgStatusDialogueField = organizationPage.getOrgStatusDropDown();
    orgStatusDialogueField.click();
    organizationPage.getDisabeledStatus().click();
    organizationPage.getSaveOrganizationButton().click();
    organizationPage.getDisableOrgNameInput().sendKeys(updatedOrganizationName);
    organizationPage.getDisableOrgConfirmationButton().click();
    organizationPage.navigateTo();
    expect(organizationPage.getOrganizationTable().isDisplayed()).toBeTruthy();
    browser.wait(ExpectedConditions.visibilityOf(
      organizationPage.getOrganizationStatusColumn(updatedOrganizationName)), 5000);
  });
});
