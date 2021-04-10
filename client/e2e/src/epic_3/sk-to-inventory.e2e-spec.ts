import {SKToInventory} from './sk-to-inventory.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/53
 * https://github.com/Fruity-Loops/ALTA/issues/55
 */
describe('AT-3.5: Assign stock-keepers to audits and AT-3.7: Review/Recap audit page', () => {
  const nav: Navigation = new Navigation();
  const skToInventory: SKToInventory = new SKToInventory();

  /**
   * Login as an Inventory Manager
   */
  beforeAll(function init(): void {
    const loginPage = new Login();
    loginPage.login_as('im@test.com', 'password', false);
  });

  /**
   * Logout
   */
  afterAll(function endit(): void {
    const logoutPage = new Logout();
    logoutPage.logout();
  });

  function proceedTillSelectSK(): void {
    nav.inventoryOption().click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getStartAudit()), 5000);
    skToInventory.getItemCheck('checkBox12731370').click();
    skToInventory.getItemCheck('checkBox12752843').click();
    skToInventory.getStartAudit().click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getExpandPanel('selectSKPanelExpand')), 5000);
    skToInventory.getExpandPanel('selectSKPanelExpand').click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getChooseSK('row3')), 5000);
  }

  function proceedTillDesignateBins(): void {
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getAssignButton()), 5000);
    skToInventory.getAssignButton().click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getExpandPanel('designateBinsPanelExpand')), 5000);
    skToInventory.getExpandPanel('designateBinsPanelExpand').click();
    skToInventory.getExpandPanel('designateBinsPanelExpand').click();
    browser.sleep(1000);
  }

  function continuePastDesignateBins(): void {
    browser.sleep(1000);
    skToInventory.getAssignButton().click();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getExpandPanel('reviewAuditPanelExpand')), 5000);
    skToInventory.getExpandPanel('reviewAuditPanelExpand').click();
    browser.sleep(1000);
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getconfirmButton()), 5000);
    skToInventory.getconfirmButton().click();
    browser.wait(ExpectedConditions.urlContains('audits'), 5000);
  }

  it('Assigning stock-keeper to audits Bins: C69 and C20', async () => {
    proceedTillSelectSK();
    skToInventory.getChooseSK('row3').click();
    proceedTillDesignateBins();
    await browser.actions().mouseDown(skToInventory.getItemToMove('C69')).perform();
    await browser.actions().mouseMove(skToInventory.getBoxToDropIn()).perform();
    await browser.actions().mouseUp(skToInventory.getBoxToDropIn()).perform();
    browser.wait(ExpectedConditions.visibilityOf(skToInventory.getItemToMove('C20')), 5000);
    browser.sleep(1000);
    await browser.actions().mouseDown(skToInventory.getItemToMove('C20')).perform();
    await browser.actions().mouseMove(skToInventory.getBoxToDropIn()).perform();
    await browser.actions().mouseUp(skToInventory.getBoxToDropIn()).perform();
    continuePastDesignateBins();
  });

  it('AT-3.9: Automatically assign bins to stock-keepers', () => {
    proceedTillSelectSK();
    skToInventory.getChooseSK('row3').click();
    skToInventory.getChooseSK('row5').click();
    proceedTillDesignateBins();
    skToInventory.getAutoAssignButton().click();
    expect(skToInventory.getFirstSKBin).toBeTruthy();
    expect(skToInventory.getSecondSKBin).toBeTruthy();
    continuePastDesignateBins();
  });

});
