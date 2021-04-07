import {AuditAssigned} from './audit-manually.po';
import {Login, Logout} from '../login.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/59
 */
describe('AT-4.4: Manually input an item’s data', () => {

    const auditManually: AuditAssigned = new AuditAssigned();

    /**
     * Login as a Stock Keeper
     */
    beforeAll(function init(): void {
        const loginPage = new Login();
        loginPage.login_as('sk@test.com');
    });

    /**
     * Logout
     */
    afterAll(function endit(): void {
        const logoutPage = new Logout();
        logoutPage.logout();
    });

    it('Input manually the barcode number: 123456789', () => {
        browser.wait(ExpectedConditions.visibilityOf(auditManually.getAudit()), 5000);
        auditManually.getAudit().click();
        browser.wait(ExpectedConditions.visibilityOf(auditManually.getBin()), 5000);
        auditManually.getBin().click();
        browser.wait(ExpectedConditions.visibilityOf(auditManually.getInputButton()), 5000);
        auditManually.getInputButton().click();
        browser.wait(ExpectedConditions.visibilityOf(auditManually.getInputField()), 5000);
        auditManually.getInputField().sendKeys('123456789');
        auditManually.getConfirmButton().click();
        browser.wait(ExpectedConditions.visibilityOf(auditManually.getaddAsNewButton()), 5000);
        auditManually.getaddAsNewButton().click();
        browser.wait(ExpectedConditions.visibilityOf(auditManually.getQuantityField()), 5000);
        auditManually.getQuantityField().sendKeys(911);
        auditManually.getSubmitButton().click();
        browser.wait(ExpectedConditions.visibilityOf(auditManually.getDismissButton()), 5000);
        auditManually.getDismissButton().click();
    });

    it('Confirms the item has been added', () => {
        browser.wait(ExpectedConditions.visibilityOf(auditManually.getCompeletedItemsButton()), 5000);
        auditManually.getCompeletedItemsButton().click();
        browser.wait(ExpectedConditions.visibilityOf(auditManually.getCompeletedManualItems()), 5000);
        expect(auditManually.getCompeletedManualItems().isDisplayed()).toBeTruthy();
        browser.refresh();
    });
});
