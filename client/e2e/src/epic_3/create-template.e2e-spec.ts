import {CreateAuditTemplate} from './create-template.po';
import {Login, Logout} from '../login.po';
import {Navigation} from '../navigation.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/51
 */
describe('AT-3.3: Create an audit template', () => {
  const nav: Navigation = new Navigation();
  const createAuditTemplate: CreateAuditTemplate = new CreateAuditTemplate();

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
    browser.wait(ExpectedConditions.visibilityOf(createAuditTemplate.getaddTemplateButton()), 5000);
    createAuditTemplate.getaddTemplateButton().click();
    browser.wait(ExpectedConditions.visibilityOf(createAuditTemplate.getTitleField()), 5000);
    createAuditTemplate.getTitleField().sendKeys('Testing Template');
    createAuditTemplate.getLocationField().sendKeys('Florida');
    createAuditTemplate.getLocationFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(createAuditTemplate.getPlantField()), 5000);
    createAuditTemplate.getPlantField().sendKeys('True');
    createAuditTemplate.getPlantFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(createAuditTemplate.getZonesField()), 5000);
    createAuditTemplate.getZonesField().sendKeys('B');
    createAuditTemplate.getZonesFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(createAuditTemplate.getAisleField()), 5000);
    createAuditTemplate.getAisleField().sendKeys('Row 1');
    createAuditTemplate.getAisleFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(createAuditTemplate.getBinsField()), 5000);
    createAuditTemplate.getBinsField().sendKeys('C20');
    createAuditTemplate.getBinsFieldButton().click();

    browser.sleep(2000);

    browser.wait(ExpectedConditions.visibilityOf(createAuditTemplate.getBinsField()), 5000);
    createAuditTemplate.getBinsField().sendKeys('C69');
    createAuditTemplate.getBinsFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(createAuditTemplate.getPartField()), 5000);
    createAuditTemplate.getPartField().sendKeys('PART-3');
    createAuditTemplate.getPartFieldButton().click();

    browser.wait(ExpectedConditions.visibilityOf(createAuditTemplate.getSerialField()), 5000);
    createAuditTemplate.getSerialField().sendKeys('SN-4');
    createAuditTemplate.getSerialFieldButton().click();

    createAuditTemplate.getDescriptionField().sendKeys('E2E Test was performed');
    createAuditTemplate.getCreateButton().click();
    browser.wait(ExpectedConditions.urlContains('template'), 5000);
    expect(createAuditTemplate.getTemplateID().isDisplayed()).toBeTruthy();
  });
});
