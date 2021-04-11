import {by, element, ElementFinder} from 'protractor';

export class CancelActiveAudit {

  getAuditRow(): ElementFinder {
    return element(by.className('outerTableAuditID9'));
  }

  getInnerTableArrow(): ElementFinder {
    return element(by.id('innerTableAuditID9'));
  }

  getInnerTable(): ElementFinder {
    return element(by.xpath('//td/div[2]/table/tbody/tr/td[2][contains(string(), "C69")]'));
  }

  getOngoingTable(): ElementFinder {
    return element(by.xpath('//*/div/table/tbody/tr/td[4][contains(string(), "C69")]'));
  }

  getCancelButton(): ElementFinder {
    return element(by.id('cancel'));
  }
}
