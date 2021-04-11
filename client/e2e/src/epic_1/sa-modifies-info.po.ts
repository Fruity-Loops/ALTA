import {by, element, ElementFinder} from 'protractor';

export class SAModifiesInfo {

  getEditButton(): ElementFinder {
    return element(by.id('editButton'));
  }

  getFirstNameField(): ElementFinder {
    return element(by.id('firstname'));
  }

  getLastNameField(): ElementFinder {
    return element(by.id('lastname'));
  }

  getPasswordField(): ElementFinder {
    return element(by.id('passwordEdit'));
  }

  getSaveButton(): ElementFinder {
    return element(by.id('saveButton'));
  }

}
