import { browser, by, element, ElementFinder } from 'protractor';

export class SettingsPage {
  navigateTo(): Promise<unknown> {
    const route = `${browser.baseUrl}/settings`;
    return browser.get(route) as Promise<unknown>;
  }

  getEditSaveButton(): ElementFinder {
    return element(by.id('signupbtn'));
  }

  getEmailInputField(): ElementFinder {
    return element(by.id('email'));
  }

  getPasswordInputField(): ElementFinder {
    return element(by.id('pass-word'));
  }

}
