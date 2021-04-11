import {AuditInsight} from './audit-insights.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/66
 */
describe('AT-5.5: Audit recommendations and insights', () => {
  const nav: Navigation = new Navigation();
  const auditInsight: AuditInsight = new AuditInsight();

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

  it('Go to Recommendation Tab', () => {
    nav.auditsOption().click();
    browser.wait(ExpectedConditions.urlContains('audits'), 5000);
    browser.wait(ExpectedConditions.visibilityOf(auditInsight.getRecommendationButton()), 5000);
    auditInsight.getRecommendationButton().click();
  });

  it('Expand Frequently Audited Bins and check it contains data', () => {
    browser.wait(ExpectedConditions.visibilityOf(auditInsight.getFreqAuditedBins()), 5000);
    auditInsight.getFreqAuditedBins().click();
    browser.wait(ExpectedConditions.visibilityOf(auditInsight.getBinC69()), 5000);
    expect(auditInsight.getBinC69().isPresent()).toBeTruthy();
  });

  it('Expand Frequently Audited Parts and check it contains data', () => {
    browser.wait(ExpectedConditions.visibilityOf(auditInsight.getFreqAuditedParts()), 5000);
    auditInsight.getFreqAuditedParts().click();
    browser.wait(ExpectedConditions.visibilityOf(auditInsight.getBatch()), 5000);
    expect(auditInsight.getBatch().isPresent()).toBeTruthy();
  });
});
