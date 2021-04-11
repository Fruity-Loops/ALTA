import {ReviewAudit} from './review-audit.po';
import {CancelActiveAudit} from '../epic_3/cancel-active-audit.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/64
 */
describe('AT-5.3: Review archived audits', () => {
  const nav: Navigation = new Navigation();
  const reviewAudit: ReviewAudit = new ReviewAudit();
  const cancelActiveAudit: CancelActiveAudit = new CancelActiveAudit();

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

  it('Confirm inner table exists by clicking on Arrow for completed audit', () => {
    nav.auditsOption().click();
    browser.wait(ExpectedConditions.urlContains('audits'), 5000);
    browser.wait(ExpectedConditions.visibilityOf(cancelActiveAudit.getInnerTableArrow()), 5000);
    cancelActiveAudit.getInnerTableArrow().click();
    expect(reviewAudit.getRowBinC69().isPresent()).toBeTruthy();
    expect(reviewAudit.getRowBinC20().isPresent()).toBeTruthy();
  });

  it('Click on Audit Row to view more details', () => {
    browser.wait(ExpectedConditions.visibilityOf(cancelActiveAudit.getAuditRow()), 5000);
    cancelActiveAudit.getAuditRow().click();
    expect(reviewAudit.getResultFirstItem().isPresent()).toBeTruthy();
    expect(reviewAudit.getResultSecondItem().isPresent()).toBeTruthy();
  });
});
