import { browser, ExpectedConditions } from 'protractor';
import { Navigation } from '../navigation.po';
import { InventoryItemsPage } from './inventory.po';
import { Login, Logout } from '../login.po';
/**
 * Supports Acceptance Tests:
 * AT-2.3:
 * https://github.com/fruity-loops/alta/issues/46
 */
describe('AT-2.3: Inventory Manager can acess their organization\'s inventory', () => {
    const inventoryPage: InventoryItemsPage = new InventoryItemsPage();
    const nav: Navigation = new Navigation();

    /**
     * Login as an Inventory Manager
     */
    beforeAll(function init(): void {
      const loginPage = new Login();
      loginPage.login_as('im@test.com', false);
    });

    /**
     * Logout
     */
    afterAll(function endit(): void {
      const logoutPage = new Logout();
      logoutPage.logout();
    });

    /**
     * i) The user clicks on Inventory.
     */
    it('should go to the organization\'s inventory page', () => {
      nav.inventoryOption().click();
      browser.wait(ExpectedConditions.urlContains('manage-items'), 5000);
    });

    /**
     * i) The table is displayed.
     * ii) The data from the table is checked against the fixtures.
     */
    it('should show inventory items from the organization', () => {
        expect(inventoryPage.getInventoryTable().isDisplayed()).toBeTruthy();
        expect(inventoryPage.getCheckBoxForID(12731370).isDisplayed()).toBeTruthy();
        expect(inventoryPage.getCheckBoxForID(12752843).isDisplayed()).toBeTruthy();
    });
  });

  /**
   * Supports Acceptance Tests:
   * AT-2.5:
   * https://github.com/fruity-loops/alta/issues/48
   */
describe('AT-2.5: Inventory Manager can search through their organization\'s inventory', () => {
  const inventoryPage: InventoryItemsPage = new InventoryItemsPage();
  const nav: Navigation = new Navigation();

  /**
   * Login as an Inventory Manager
   */
  beforeAll(function init(): void {
    const loginPage = new Login();
    loginPage.login_as('im@test.com', false);
  });

  /**
   * Logout
   */
  afterAll(function endit(): void {
    const logoutPage = new Logout();
    logoutPage.logout();
  });

  /**
   * i) The user clicks on Inventory.
   */
  it('should go to the organization\'s inventory page', () => {
    nav.inventoryOption().click();
    browser.wait(ExpectedConditions.urlContains('manage-items'), 5000);
  });

  /**
   * i) The table is displayed.
   * ii) The search data is filled in.
   * iii) The table displays the changes.
   */
  it('should show inventory items searched for', () => {
      expect(inventoryPage.getInventoryTable().isDisplayed()).toBeTruthy();
      inventoryPage.getSearchInputField().sendKeys('False');
      inventoryPage.getSearchButton().click();
      expect(inventoryPage.getCheckBoxForID(12731370).isDisplayed()).toBeTruthy();
      expect(browser.isElementPresent(inventoryPage.getCheckBoxForID(12752843))).toBeFalsy();
  });
});
