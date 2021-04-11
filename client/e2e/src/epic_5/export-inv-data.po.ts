import {by, element, ElementFinder} from 'protractor';

export class ExportInvData {

  getRowWithCompleteStatus(): ElementFinder {
    return element(by.xpath('//*/div/table/tbody/tr/td[6]/div'));
  }

  getExportAuditButton(): ElementFinder {
    return element(by.id('export-audit'));
  }

  getCommentButton(): ElementFinder {
    return element(by.id('questionanswericon'));
  }

  getCommentField(): ElementFinder {
    return element(by.id('enterComment'));
  }

  getSendButton(): ElementFinder {
    return element(by.id('sendicon'));
  }

  getText(): ElementFinder {
    return element(by.xpath('//*/div/div[2][contains(string(), "This is a E2E Test!")]'));
  }

}
