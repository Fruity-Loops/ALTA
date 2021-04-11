import {by, element, ElementFinder} from 'protractor';

export class ExportInvData {

  getRowWithCompleteStatus(): ElementFinder {
    return element(by.xpath('//*/div/table/tbody/tr/td[6]/div'));
  }

  getExportAuditButton(): ElementFinder {
    return element(by.id('export-audit'));
  }
}
