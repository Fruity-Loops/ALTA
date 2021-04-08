import {SKToInventory} from './sk-to-inventory.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/53
 */
describe('AT-3.5: Assign stock-keepers to audits', () => {
  const nav: Navigation = new Navigation();
  const skToInventory: SKToInventory = new SKToInventory();

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

  it('Assigning stock-keepers to audits Bins: C69 and C20', async () => {
    nav.inventoryOption().click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getStartAudit()), 5000);
    skToInventory.getItemCheck('checkBox12731370').click();
    skToInventory.getItemCheck('checkBox12752843').click();
    skToInventory.getStartAudit().click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getExpandPanel('selectSKPanelExpand')), 5000);
    skToInventory.getExpandPanel('selectSKPanelExpand').click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getSelectCheck()), 5000);
    skToInventory.getSelectCheck().click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getAssignButton()), 5000);
    skToInventory.getAssignButton().click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getExpandPanel('designateBinsPanelExpand')), 5000);
    skToInventory.getExpandPanel('designateBinsPanelExpand').click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getBoxToDropIn()), 5000);
    await browser.actions().mouseDown(skToInventory.getItemToMove('C69')).perform();
    await browser.actions().mouseMove(skToInventory.getBoxToDropIn()).perform();
    await browser.actions().mouseUp(skToInventory.getBoxToDropIn()).perform();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getItemToMove('C20')), 5000);
    browser.sleep(1000);
    await browser.actions().mouseDown(skToInventory.getItemToMove('C20')).perform();
    await browser.actions().mouseMove(skToInventory.getBoxToDropIn()).perform();
    await browser.actions().mouseUp(skToInventory.getBoxToDropIn()).perform();
    browser.sleep(1000);
    skToInventory.getAssignButton().click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getExpandPanel('reviewAuditPanelExpand')), 5000);
    skToInventory.getExpandPanel('reviewAuditPanelExpand').click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getconfirmButton()), 5000);
    skToInventory.getconfirmButton().click();
    browser.wait(ExpectedConditions.urlContains('audits'), 5000);
  });
});
