import {by, element, ElementFinder} from 'protractor';

export class AuditInsight {

  getRecommendationButton(): ElementFinder {
    return element(by.xpath('//*[@id="mat-tab-label-0-3"]'));
  }

  getFreqAuditedBins(): ElementFinder {
    return element(by.id('FreqAuditedBins'));
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
