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

  getChooseSK(rowNumber: string): ElementFinder {
    return element(by.id(rowNumber));
  }

  getAssignButton(): ElementFinder {
    return element(by.id('assign'));
  }

  getItemToMove(item: string): ElementFinder {
    return element(by.id(item));
  }

  getBoxToDropIn(): ElementFinder {
    return element(by.id('boxToDropIn3'));
  }

  getconfirmButton(): ElementFinder {
    return element(by.id('confirm'));
  }

  getAutoAssignButton(): ElementFinder {
    return element(by.id('designateBinsAutoAssign'));
  }

  getFirstSKBin(): ElementFinder {
    return element(by.xpath('//div[@id=\'boxToDropIn3\']/div[contains(string(), "C69")]'));
  }

  getSecondSKBin(): ElementFinder {
    return element(by.xpath('//div[@id=\'boxToDropIn5\']/div[contains(string(), "C20")]'));
  }

}
