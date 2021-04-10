import {CancelActiveAudit} from './cancel-active-audit.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/194
 */
describe('AT-3.10: Cancel an active audit', () => {
  const nav: Navigation = new Navigation();
  const cancelActiveAudit: CancelActiveAudit = new CancelActiveAudit();

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

  it('Cancelled the Audit', () => {
    nav.auditsOption().click();
    browser.wait(ExpectedConditions.visibilityOf(cancelActiveAudit.getAuditRow()), 5000);
    cancelActiveAudit.getInnerTableArrow().click();
    browser.wait(ExpectedConditions.visibilityOf(cancelActiveAudit.getInnerTable()), 5000);
    cancelActiveAudit.getAuditRow().click();
    browser.wait(ExpectedConditions.visibilityOf(cancelActiveAudit.getOngoingTable()), 5000);
    browser.wait(ExpectedConditions.visibilityOf(cancelActiveAudit.getCancelButton()), 5000);
    cancelActiveAudit.getCancelButton().click();
    browser.switchTo().alert().accept();
    browser.wait(ExpectedConditions.urlContains('audits'), 5000);
    expect(cancelActiveAudit.getAuditRow().isPresent()).toBeFalsy();
  });
});
