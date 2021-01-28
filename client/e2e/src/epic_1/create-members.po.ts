import { browser, by, element, ElementFinder } from 'protractor';

export class CreateMembersPage {
  navigateTo(): Promise<unknown> {
    const route = `${browser.baseUrl}/create-members`;
    return browser.get(route) as Promise<unknown>;
  }

  getFirstNameField(): ElementFinder {
    return element(by.id('firstname'));
  }

  getLastNameField(): ElementFinder {
    return element(by.id('lastname'));
  }

  getEmailField(): ElementFinder {
    return element(by.id('email'));
  }

  getEmployeeIdField(): ElementFinder {
    return element(by.id('user_name'));
  }

  getPasswordField(): ElementFinder {
    return element(by.id('pass-word'));
  }

  getLocationField(): ElementFinder {
    return element(by.id('location'));
  }

  getSaveButton(): ElementFinder {
    return element(by.id('signupbtn'));
  }

  getRoleDropDown(): ElementFinder {
    return element(by.className('roleDropDown'));
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
}
