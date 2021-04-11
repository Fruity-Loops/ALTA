import {CompleteAuditGraph} from './complete-audit-graph.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {CreateMembersPage} from '../epic_1/create-members.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/62
 */
describe('AT-5.1: View an audit report in a graphical format', () => {
  const nav: Navigation = new Navigation();
  const completeAuditGraph: CompleteAuditGraph = new CompleteAuditGraph();

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

  it('Go to Graph Tab', () => {
    nav.auditsOption().click();
    browser.wait(ExpectedConditions.urlContains('audits'), 5000);
    browser.wait(ExpectedConditions.visibilityOf(completeAuditGraph.getGraphAndTrendsButton()), 5000);
    completeAuditGraph.getGraphAndTrendsButton().click();
  });

  it('Ensure Graph is shown and the download to CSV option is displayed', () => {
    browser.wait(ExpectedConditions.visibilityOf(completeAuditGraph.getGraph()), 5000);
    completeAuditGraph.get1MonthButton().click();
    completeAuditGraph.get1YearButton().click();
    completeAuditGraph.getZoomInButton().click();
    browser.sleep(1000);
    completeAuditGraph.getZoomInButton().click();
    browser.sleep(1000);
    completeAuditGraph.getZoomInButton().click();
    browser.sleep(1000);
    completeAuditGraph.getZoomOutButton().click();
    browser.sleep(1000);
    completeAuditGraph.getHomeButton().click();
    browser.sleep(1000);
    completeAuditGraph.getGraphMenuButton().click();
    expect(completeAuditGraph.getDownlaodCSVButton().isDisplayed()).toBeTruthy();
    completeAuditGraph.getGraphMenuButton().click();
  });
});
