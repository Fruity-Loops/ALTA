import {by, element, ElementFinder} from 'protractor';

export class ReviewAudit {

  getRowBinC69(): ElementFinder {
    return element(by.xpath('//*/tr[16]/td/div/table/tbody/tr[1]/td[2]/t[contains(string(), "C69")]'));
  }

  getRowBinC20(): ElementFinder {
    return element(by.xpath('//*/tr[16]/td/div/table/tbody/tr[2]/td[2]/t[contains(string(), "C20")]'));
  }

  getResultFirstItem(): ElementFinder {
    return element(by.xpath('//*/div/table/tbody/tr[1]/td[10][contains(string(), "Provided")]'));
  }

  getResultSecondItem(): ElementFinder {
    return element(by.xpath('//*/div/table/tbody/tr[2]/td[10][contains(string(), "Provided")]'));
  }

}
