import { browser, by, element, ElementFinder } from 'protractor';

export class OrganizationPage {
  navigateTo(): Promise<unknown> {
    const route = `${browser.baseUrl}/#/manage-organizations`;
    return browser.get(route) as Promise<unknown>;
  }
  getAddOrganizationButton(): ElementFinder {
    return element(by.id('createOrg'));
  }

  getOrganizationTable(): ElementFinder {
    return element(by.tagName('table'));
  }

  getOrganizationNameDialogueField(): ElementFinder {
    return element(by.id('EditOrgName'));
  }

  getOrganizationLocationDialogueField(): ElementFinder {
    return element(by.id('EditOrgLocation'));
  }

  getOrganizationNameColumn(organizationName: string): ElementFinder {
    return element(by.cssContainingText(
      '.cell_org_name',
      organizationName)
    );
  }

  getOrganizationStatusColumn(organizationName: string): ElementFinder {
    return element(by.id(organizationName + ' status'));
  }

  getOrgSettings(name: string): ElementFinder {
    return element(by.id('settings ' + name));
  }

  getOrgEditButton(): ElementFinder {
    return element(by.id('editOrganizationButton'));
  }

  getOrgStatusDropDown(): ElementFinder {
    return element(by.id('orgStatusDropDown'));
  }

  getDisabeledStatus(): ElementFinder {
    return element(by.id('Disabled'));
  }

  getSaveOrganizationButton(): ElementFinder {
    return element(by.id('saveEditOrganizationButton'));
  }

  getDisableOrgNameInput(): ElementFinder {
    return element(by.id('disableOrgNameInput'));
  }

  nextPageButton(): ElementFinder {
    return element(by.className('mat-paginator-navigation-next'));
  }

  getDisableOrgConfirmationButton(): ElementFinder {
    return element(by.id('confirmDisableOrg'));
  }
}
