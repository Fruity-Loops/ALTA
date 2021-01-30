import { Navigation } from './navigation.po';
import { browser, ExpectedConditions } from 'protractor';

// File doesn't exist? Consider removing this import
// @ts-ignore
import { SettingsPage } from './settings.po';


/**
 * Supports Acceptance Test AT-1.2: System administrator modifies their account information
 * https://github.com/Fruity-Loops/ALTA/issues/130
 */
describe('AT-1.2 System administrator modifies their account information', () => {
  const settingsPage: SettingsPage = new SettingsPage();
  const nav: Navigation = new Navigation();

  /**
   * Given that the user is logged in as a system administrator and selects the Settings side menu option
   */
  it('should navigate to settings page', () => {
    nav.home().click();
    nav.settingsOption().click();
    browser.wait(ExpectedConditions.urlContains('settings'), 5000);
  });

  /**
   * The user should be presented with a form containing their previously supplied user information.
   * The user selects the Edit button to allow the fields to accept input.
   * Once the information is modified, the user selects the Save button to store the updated data.
   * TODO: COMPARE PREVIOUS AND NEW DATA
   */
  it('should edit user information', () => {
    settingsPage.getEditSaveButton().click();
    settingsPage.getEmailInputField().clear();
    settingsPage.getEmailInputField().sendKeys('new_email@email.com');
    settingsPage.getPasswordInputField().clear();
    settingsPage.getPasswordInputField().sendKeys('new_pass');
    settingsPage.getEditSaveButton().click();
    browser.wait(ExpectedConditions.urlContains('settings'), 5000);
  });
});
