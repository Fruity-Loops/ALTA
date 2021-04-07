import {by, element, ElementFinder} from 'protractor';

export class AuditAssigned {

  getCreateButton(): ElementFinder {
    return element(by.id('create'));
  }

  getFirstName(): ElementFinder {
    return element(by.id('firstname'));
  }

  getLastName(): ElementFinder {
    return element(by.id('lastname'));
  }

  getPassword(): ElementFinder {
    return element(by.id('passwordCreate'));
  }

  getRole(): ElementFinder {
    return element(by.id('roleDropDown'));
  }

  getRoleOption(): ElementFinder {
    return element(by.id('Stock Keeper'));
  }

  getEmail(): ElementFinder {
    return element(by.id('email'));
  }

  getEmployeeID(): ElementFinder {
    return element(by.id('user_name'));
  }

  getEmployeeLocation(): ElementFinder {
    return element(by.id('location'));
  }

  getSaveButton(): ElementFinder {
    return element(by.id('saveButton'));
  }

  getEmployeeTable(): ElementFinder {
    return element(by.id('saveButton'));
  }

  getFirstNameColumn(firstName: string): ElementFinder {
    return element(by.cssContainingText(
      '.cell_first_name',
      firstName)
    );
  }
}
