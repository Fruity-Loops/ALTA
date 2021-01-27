import { browser, ExpectedConditions } from 'protractor';
import { Navigation } from '../navigation.po';
import { ManageMembersPage } from '../epic_1/manage-members.po';
import { OrganizationPage } from '../epic_1/organization.po';
import { SettingsPage } from '../epic_1/settings.po';
import { Login, Logout } from '../login.po'
/**
 * Supports Acceptance Tests:
 * AT-2.2:
 * https://github.com/fruity-loops/alta/issues/45
 */
describe('AT-2.2: Inventory Manager can modify their own settings', () => {
    const manageMembersPage: ManageMembersPage = new ManageMembersPage();
    const settingsPage: SettingsPage = new SettingsPage();
    const organizationPage: OrganizationPage = new OrganizationPage();
    const nav: Navigation = new Navigation();

    /**
     * Login as an Inventory Manager
     */
    beforeAll(function () {
      const loginPage = new Login();
      loginPage.login_as('im@test.com', false);
      browser.sleep(5000);
    });

    /**
     * Logout
     */
    afterAll(function () {
      const logoutPage = new Logout();
      logoutPage.logout();
    });

    /**
     * i) The user clicks on their settings.
     */
    it('should go to the employee\'s settings page', () => {
      nav.settingsOption().click();
      browser.wait(ExpectedConditions.urlContains('settings'), 5000);
    });

    /**
     * i) The user fills in the form with the modified info.
     * ii) The user selects the Save button to store the updated data.
     * iii) The data in the settings page is verified to be changed.
     */
    it('should edit user information including: status, firstname, lastname and location', () => {
      settingsPage.getEditButton().click();
      settingsPage.getFirstNameField().clear();
      settingsPage.getFirstNameField().sendKeys('name');
      settingsPage.getLastNameField().clear();
      settingsPage.getLastNameField().sendKeys('name');
      settingsPage.getLocationInputField().clear();
      settingsPage.getLocationInputField().sendKeys('Moreal Nord');
      settingsPage.getSaveButton().click();
      settingsPage.getEditButton().click();
      expect(settingsPage.getFirstNameField().getAttribute('value')).toBe('name');
      expect(settingsPage.getLastNameField().getAttribute('value')).toBe('name');
      expect(settingsPage.getLocationInputField().getAttribute('value')).toBe('Moreal Nord');
    });
  });
