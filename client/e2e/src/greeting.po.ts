import { browser, by, element, ElementFinder } from 'protractor';

export class GreetingPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getLoginForm(): ElementFinder {
    return element(by.tagName('app-login'));
  }

  getEmailInputField(): ElementFinder {
    return element(by.id('email'));
  }

  getPasswordInputField(): ElementFinder {
    return element(by.id('password'));
  }

  getLoginButton(): ElementFinder {
    return element(by.id('loginbtn'));
  }

}
