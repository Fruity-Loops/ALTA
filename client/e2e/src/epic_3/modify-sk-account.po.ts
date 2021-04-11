import {by, element, ElementFinder} from 'protractor';

export class ModifySKAccount {

  getSettingButton(): ElementFinder {
    return element(by.id('FN TestLN Testsettings'));
  }

  getEditButton(): ElementFinder {
    return element(by.id('editButton'));
  }
}
