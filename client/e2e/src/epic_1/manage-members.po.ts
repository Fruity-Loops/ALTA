import { browser, by, element, ElementFinder } from 'protractor';

export class ManageMembersPage {
  navigateTo(): Promise<unknown> {
    const route = `${browser.baseUrl}/#/modify-members`;
    return browser.get(route) as Promise<unknown>;
  }

  getCreateMemberButton(): ElementFinder {
    return element(by.id('create'));
  }

  getMembersTable(): ElementFinder {
    return element(by.tagName('table'));
  }


  getFirstNameColumn(firstName): ElementFinder {
    return element(by.cssContainingText(
      '.cell_first_name',
      firstName)
      );
  }

  getEmplopyeeSettingsButton(): ElementFinder {
    return element(by.className('cell_settings'));
  }
}
