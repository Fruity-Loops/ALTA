import {ExportInvData} from './export-inv-data.po';
import {CancelActiveAudit} from '../epic_3/cancel-active-audit.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/63
 */
describe('AT-5.2: Export audit results in csv file', () => {
  const nav: Navigation = new Navigation();
  const exportInvData: ExportInvData = new ExportInvData();
  const cancelActiveAudit: CancelActiveAudit = new CancelActiveAudit();

  /**
   * Login as an Inventory Manager
   */
  beforeAll(function init(): void {
    const loginPage = new Login();
    loginPage.login_as('im@test.com', 'password', false);
  });

  it('Click on Completed Audit', () => {
    nav.auditsOption().click();
    browser.wait(ExpectedConditions.urlContains('audits'), 5000);
    browser.wait(ExpectedConditions.visibilityOf(cancelActiveAudit.getAuditRow()), 5000);
    cancelActiveAudit.getAuditRow().click();
  });

  it('Click on Export Audit to download CSV File', () => {
    browser.wait(ExpectedConditions.visibilityOf(exportInvData.getRowWithCompleteStatus()), 5000);
    exportInvData.getExportAuditButton().click();
  });
});
