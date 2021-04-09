import {AuditTemplate} from './audt-template.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/51
 * https://github.com/fruity-loops/alta/issues/52
 */
describe('AT-3.3: Create an audit template', () => {
  const nav: Navigation = new Navigation();
  const auditTemplate: AuditTemplate = new AuditTemplate();

  /**
   * Login as an Inventory Manager
   */
  beforeAll(function init(): void {
    const loginPage = new Login();
    loginPage.login_as('im@test.com', false);
  });

  /**
   * Logout
   */
  afterAll(function endit(): void {
    const logoutPage = new Logout();
    logoutPage.logout();
  });

  it('Create an Audit Template', () => {
    nav.templatesOption().click();
    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getaddTemplateButton()), 5000);
    auditTemplate.getaddTemplateButton().click();
    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getTitleField()), 5000);
    auditTemplate.getTitleField().sendKeys('Testing Template');
    auditTemplate.getLocationField().sendKeys('Florida');
    auditTemplate.getLocationFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getPlantField()), 5000);
    auditTemplate.getPlantField().sendKeys('True');
    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getPlantFieldButton()), 5000);
    auditTemplate.getPlantFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getZonesField()), 5000);
    auditTemplate.getZonesField().sendKeys('B');
    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getZonesFieldButton()), 5000);
    auditTemplate.getZonesFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getAisleField()), 5000);
    auditTemplate.getAisleField().sendKeys('Rows');
    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getAisleFieldButton()), 5000);
    auditTemplate.getAisleFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getBinsField()), 5000);
    auditTemplate.getBinsField().sendKeys('C20');
    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getBinsFieldButton()), 5000);
    auditTemplate.getBinsFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getBinsField()), 5000);
    auditTemplate.getBinsField().sendKeys('C69');
    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getBinsFieldButton()), 5000);
    auditTemplate.getBinsFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getPartField()), 5000);
    auditTemplate.getPartField().sendKeys('PART-3');
    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getPartFieldButton()), 5000);
    auditTemplate.getPartFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getSerialField()), 5000);
    auditTemplate.getSerialField().sendKeys('SN-4');
    browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getSerialFieldButton()), 5000);
    auditTemplate.getSerialFieldButton().click();

    auditTemplate.getDescriptionField().sendKeys('E2E Test was performed');
    auditTemplate.getCreateButton().click();
    browser.wait(ExpectedConditions.urlContains('template'), 5000);
    expect(auditTemplate.getTemplateID('Testing Template').isDisplayed()).toBeTruthy();
  });

  describe('AT-3.4: Modify audit template', () => {
    it('Modify an Audit Template', () => {
      nav.templatesOption().click();
      browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getMenu()), 5000);
      auditTemplate.getMenu().click();
      browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getEditOption()), 5000);
      auditTemplate.getEditOption().click();
      browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getEditButton()), 5000);
      auditTemplate.getEditButton().click();
      auditTemplate.getTitleField().clear();
      auditTemplate.getTitleField().sendKeys('Modified Testing Template');
      auditTemplate.getRemoveItem('Aisle: Rows').click();
      auditTemplate.getRemoveItem('Bin: C20').click();
      auditTemplate.getCreateButton().click();
      browser.wait(ExpectedConditions.visibilityOf(auditTemplate.getEditButton()), 5000);
      nav.templatesOption().click();
      browser.wait(ExpectedConditions.urlContains('template'), 5000);
      expect(auditTemplate.getTemplateID('Modified Testing Template').isDisplayed()).toBeTruthy();
    });
  });

});
