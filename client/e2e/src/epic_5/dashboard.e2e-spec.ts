import {Dashboard} from './dashboard.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/195
 */
describe('AT-5.7: Dashboard of recent audit activity', () => {
  const nav: Navigation = new Navigation();
  const dashboard: Dashboard = new Dashboard();

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

  it('Verifying most recent audits table exists', () => {
    browser.wait(ExpectedConditions.urlContains('dashboard'), 5000);
    browser.wait(ExpectedConditions.visibilityOf(dashboard.getNextButton()), 5000);
    dashboard.getNextButton().click();
    browser.wait(ExpectedConditions.visibilityOf(dashboard.getIDData()), 5000);
    expect(dashboard.getIDData().isPresent()).toBeTruthy();
  });

  it('Verifying audit over time graph exists', () => {
    browser.wait(ExpectedConditions.visibilityOf(dashboard.getGraph()), 5000);
    expect(dashboard.getGraph().isPresent()).toBeTruthy();
  });
});
