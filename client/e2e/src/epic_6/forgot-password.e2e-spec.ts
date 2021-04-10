import {ResetPassword} from './forgot-password.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import { GreetingPage } from '../greeting.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/198
 */
describe('AT-6.1: Reset account password', () => {
  const nav: Navigation = new Navigation();
  const resetPassword: ResetPassword = new ResetPassword();
  const greetingPage: GreetingPage = new GreetingPage();

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

  it('User Resets their Password', () => {
    greetingPage.navigateTo();
  });
});
