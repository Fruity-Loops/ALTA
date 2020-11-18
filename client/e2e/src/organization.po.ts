import { browser, by, element, ElementFinder } from 'protractor';

export class OrganizationPage {
  navigateTo(): Promise<unknown> {
    const route = `${browser.baseUrl}/manage-organizations`;
    return browser.get(route) as Promise<unknown>;
  }
  getAddOrganizationButton(): ElementFinder {
    return element(by.id('create'));
  }

  getOrganizationTable(): ElementFinder {
    return element(by.tagName('table'));
  }

  getOrganizationNameDialogueField(): ElementFinder {
    // Must use xpath as I do not know of any other unique was to identify dialogues opened programically
    return element(by.xpath('//mat-dialog-container/app-organization-dialog/div/mat-form-field/div/div/div/input'));
  }

  getCreateOrganizationDialogueButton(): ElementFinder {
    return element(by.cssContainingText(
      '.mat-button-wrapper',
      'Create')
    );
  }

  getOrganizationColumn(organizationName): ElementFinder {
    return element(by.cssContainingText(
      '.cell_org_name',
      organizationName)
    );
  }

  getCellMatMenu(): ElementFinder {
    return element(by.className('mat-button'));
  }

  getOrganizationMatMenuItemUpdate(): ElementFinder {
    return element(by.className('org_mat_menu_item_update'));
  }


  getUpdateOrganizationDialogueButton(): ElementFinder {
    return element(by.cssContainingText(
      '.mat-button-wrapper',
      'Update')
    );
  }

  getOrganizationMatMenuItemDelete(): ElementFinder {
    return element(by.className('org_mat_menu_item_delete'));
  }


  getDeleteOrganizationDialogueButton(): ElementFinder {
    return element(by.cssContainingText(
      '.mat-button-wrapper',
      'Delete')
    );
  }
}
