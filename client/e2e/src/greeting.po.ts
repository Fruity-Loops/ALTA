import { browser, by, element, ElementFinder } from 'protractor';

export class GreetingPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getLoginForm(): ElementFinder {
    return element(by.tagName('app-login'));
  }
}
