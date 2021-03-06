import {ExportInvData} from './export-inv-data.po';
import {CancelActiveAudit} from '../epic_3/cancel-active-audit.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/63
 * https://github.com/fruity-loops/alta/issues/67
 */
describe('AT-5.2: Export audit results in csv file and AT-5.6: Comment on an audit report', () => {
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

  it('Click on Comment Board and leave a comment', () => {
    browser.wait(ExpectedConditions.visibilityOf(exportInvData.getCommentButton()), 5000);
    exportInvData.getCommentButton().click();
    exportInvData.getCommentField().sendKeys('This is a E2E Test!');
    exportInvData.getSendButton().click();
    browser.refresh();
    browser.wait(ExpectedConditions.visibilityOf(exportInvData.getCommentButton()), 5000);
    exportInvData.getCommentButton().click();
    browser.wait(ExpectedConditions.visibilityOf(exportInvData.getText()), 5000);
    expect(exportInvData.getText().isPresent()).toBeTruthy();
  });

  it('Click on Export Audit to download CSV File', () => {
    browser.wait(ExpectedConditions.visibilityOf(exportInvData.getRowWithCompleteStatus()), 5000);
    exportInvData.getExportAuditButton().click();
  });
});
