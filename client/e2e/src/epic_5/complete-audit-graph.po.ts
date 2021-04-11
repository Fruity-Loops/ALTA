import {by, element, ElementFinder} from 'protractor';

export class CompleteAuditGraph {

  getGraphAndTrendsButton(): ElementFinder {
    return element(by.xpath('//*[@id="mat-tab-label-0-1"]/div'));
  }

  getGraph(): ElementFinder {
    return element(by.id('chart'));
  }

  get1MonthButton(): ElementFinder {
    return element(by.xpath('//*[@id="chart"]/button[1]'));
  }

  get1YearButton(): ElementFinder {
    return element(by.xpath('//*[@id="chart"]/button[5]'));
  }

  getZoomInButton(): ElementFinder {
    return element(by.className('apexcharts-zoomin-icon'));
  }

  getZoomOutButton(): ElementFinder {
    return element(by.className('apexcharts-zoomout-icon'));
  }

  getHomeButton(): ElementFinder {
    return element(by.className('apexcharts-reset-icon'));
  }

  getGraphMenuButton(): ElementFinder {
    return element(by.className('apexcharts-menu-icon'));
  }

  getDownlaodCSVButton(): ElementFinder {
    return element(by.className('apexcharts-menu-item exportCSV'));
  }
}
