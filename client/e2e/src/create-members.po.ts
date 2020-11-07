import { browser, by, element, ElementFinder } from 'protractor';

export class CreateMembersPage {
  navigateTo(): Promise<unknown> {
    const route = `${browser.baseUrl}/create-members`
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

  getSaveButton(): ElementFinder {
    return element(by.id('signupbtn'));
  }  
}
