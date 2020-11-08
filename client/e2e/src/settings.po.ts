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

  getRoleDropDown(): ElementFinder {
    return element(by.className('roleDropDown'));
  }

  getRoleSA(): ElementFinder {
    return element(by.cssContainingText(
      '.mat-option-text',
      'System Admin')
    );
  }

  getRoleIM(): ElementFinder {
    return element(by.cssContainingText(
      '.mat-option-text',
      'Inventory Manager')
    );
  }

  getRoleSK(): ElementFinder {
    return element(by.cssContainingText(
      '.mat-option-text',
      'Stock Keeper')
    );
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

  getRoleInactive(): ElementFinder {
    return element(by.cssContainingText(
      '.mat-option-text',
      'disabled')
    );
  }




}
