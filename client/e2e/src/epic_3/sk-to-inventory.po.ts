import {by, element, ElementFinder} from 'protractor';

export class SKToInventory {

  getStartAudit(): ElementFinder {
    return element(by.id('create'));
  }

  getItemCheck(item: string): ElementFinder {
    return element(by.id(item));
  }

  getExpandPanel(name: string): ElementFinder {
    return element(by.id(name));
  }

  getSelectCheck(): ElementFinder {
    return element(by.id('row3'));
  }

  getAssignButton(): ElementFinder {
    return element(by.id('assign'));
  }

  getItemToMove(item: string): ElementFinder {
    return element(by.id(item));
  }

  getBoxToDropIn(): ElementFinder {
    return element(by.id('boxToDropIn'));
  }

  getconfirmButton(): ElementFinder {
    return element(by.id('confirm'));
  }

}
