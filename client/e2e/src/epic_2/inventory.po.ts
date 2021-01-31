import { by, element, ElementFinder } from 'protractor';

export class InventoryItemsPage {

  getInventoryTable(): ElementFinder {
    return element(by.tagName('table'));
  }

  getCheckBoxForID(id: number): ElementFinder {
    return element(by.id('checkBox' + id + '-input'));
  }

  getSearchInputField(): ElementFinder {
    return element(by.id('inventorySearchBar'));
  }

  getSearchButton(): ElementFinder {
    return element(by.id('searchbtn'));
  }
}
