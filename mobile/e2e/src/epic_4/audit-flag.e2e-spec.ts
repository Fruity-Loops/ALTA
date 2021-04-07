import {AuditFlag} from './audit-flag.po';
import {Login, Logout} from '../login.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/60
 * https://github.com/fruity-loops/alta/issues/61
 * https://github.com/fruity-loops/alta/issues/70
 */
describe('AT-4.5: Flag an item as missing or new, AT-4.6: Comment on a flagged item and AT-4.7: View items assigned to an audit', () => {

    const auditFlag: AuditFlag = new AuditFlag();

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

    // Flag item way #1. Way #2 is already tested during manually input testing therefore won't be tested in here.
    it('Flag an item using the first way', () => {
        browser.wait(ExpectedConditions.visibilityOf(auditFlag.getAudit()), 5000);
        auditFlag.getAudit().click();
        browser.wait(ExpectedConditions.visibilityOf(auditFlag.getBin()), 5000);
        auditFlag.getBin().click();
        browser.wait(ExpectedConditions.visibilityOf(auditFlag.getFlagButton()), 5000);
        auditFlag.getFlagButton().click();
        browser.wait(ExpectedConditions.visibilityOf(auditFlag.getSubmitButton()), 5000);
        expect(auditFlag.getFlagChecked().getAttribute('aria-checked')).toBe('true');
        auditFlag.getCommentBox().sendKeys('Adding some comments :)');
        auditFlag.getSubmitButton().click();
        browser.wait(ExpectedConditions.visibilityOf(auditFlag.getDismissButton()), 5000);
        auditFlag.getDismissButton().click();
    });

    it('Confirms the flagged item has been added under completed items and the comment is there as well', () => {
        browser.wait(ExpectedConditions.visibilityOf(auditFlag.getCompletedItemsButton()), 5000);
        auditFlag.getCompletedItemsButton().click();
        browser.wait(ExpectedConditions.visibilityOf(auditFlag.getCompletedItems()), 5000);
        expect(auditFlag.getCompletedItems().isDisplayed()).toBeTruthy();
        auditFlag.getOptionsButton().click();
        browser.wait(ExpectedConditions.visibilityOf(auditFlag.getEditButton()), 5000);
        auditFlag.getEditButton().click();
        expect(auditFlag.getCommentBox().getAttribute('value')).toBe('Adding some comments :)');
        browser.refresh();
    });
});
