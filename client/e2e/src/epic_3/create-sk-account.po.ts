import {by, element, ElementFinder} from 'protractor';

export class CreateSKAccount {

  getCreateButton(): ElementFinder {
    return element(by.id('create'));
  }

  getRoleOption(): ElementFinder {
    return element(by.id('Stock Keeper'));
  }

  getFirstNameColumn(firstName: string): ElementFinder {
    return element(by.cssContainingText(
      '.cell_first_name',
      firstName)
    );
  }
}
