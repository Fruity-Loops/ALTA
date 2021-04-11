import {by, element, ElementFinder} from 'protractor';

export class Dashboard {

  getNextButton(): ElementFinder {
    return element(by.xpath('//*/button[2]'));
  }

  getIDData(): ElementFinder {
    return element(by.xpath('//*/div/table[contains(string(), "8")]'));
  }

  getGraph(): ElementFinder {
    return element(by.id('chart'));
  }

  getBinC69(): ElementFinder {
    return element(by.xpath('//*/div/table[contains(string(), "C69")]'));
  }

  getBatch(): ElementFinder {
    return element(by.xpath('//*[@id="cdk-accordion-child-1"]/div/table[contains(string(), "12752843")]'));
  }

  getFreqAuditedParts(): ElementFinder {
    return element(by.id('FreqAuditedParts'));
  }

}
