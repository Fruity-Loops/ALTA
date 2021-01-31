import { browser, by, element, ElementFinder } from 'protractor';

export class SettingsPage {
  navigateTo(): Promise<unknown> {
    const route = `${browser.baseUrl}/settings`;
    return browser.get(route) as Promise<unknown>;
  }

  getFirstNameField(): ElementFinder {
    return element(by.id('firstname'));
  }

  getLastNameField(): ElementFinder {
    return element(by.id('lastname'));
  }

  getEditButton(): ElementFinder {
    return element(by.id('editButton'));
  }

  getSaveButton(): ElementFinder {
    return element(by.id('saveButton'));
  }

  getEmailInputField(): ElementFinder {
    return element(by.id('email'));
  }

  getPasswordInputField(): ElementFinder {
    return element(by.id('passwordCreate'));
  }

  getLocationInputField(): ElementFinder {
    return element(by.id('location'));
  }

  getStatusDropDown(): ElementFinder {
    return element(by.className('statusDropDown'));
  }

  getStatusActive(): ElementFinder {
    return element(by.cssContainingText(
      '.mat-option-text',
      'active')
    );
  }

  getStatusDisabled(): ElementFinder {
    return element(by.cssContainingText(
      '.mat-option-text',
      'disabled')
    );
  }
}
