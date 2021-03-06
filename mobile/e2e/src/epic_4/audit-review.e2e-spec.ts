import {AuditReview} from './audit-review.po';
import {Login, Logout} from '../login.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/57
 */
describe('AT-4.2: Review the list of inputted items of an ongoing audit', () => {

    const auditProgress: AuditReview = new AuditReview();

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

    function progressionVisibility() {
        browser.wait(ExpectedConditions.visibilityOf(auditProgress.getcompleteAuditField()), 5000);
        expect(auditProgress.getcompleteAuditField().isDisplayed()).toBeTruthy();
        expect(auditProgress.getitemLeftAuditField().isDisplayed()).toBeTruthy();
        expect(auditProgress.getCompletionAuditField().isDisplayed()).toBeTruthy();
        expect(auditProgress.getAccuracyAuditField().isDisplayed()).toBeTruthy();
        auditProgress.getClickOutside().click();
    }

    it('Should click on the i button on the right side of an audit to view a banner containing progression', () => {
        browser.wait(ExpectedConditions.visibilityOf(auditProgress.getInfoButton()), 5000);
        auditProgress.getInfoButton().click();
        progressionVisibility();
    });

    it('Click on the Audit then click on the i button for that bin progression', () => {
        browser.wait(ExpectedConditions.visibilityOf(auditProgress.getAudit()), 5000);
        auditProgress.getAudit().click();
        browser.wait(ExpectedConditions.visibilityOf(auditProgress.getInfoButtonBin()), 5000);
        auditProgress.getInfoButtonBin().click();
        progressionVisibility();
    });

    it('Confirm item presence', () => {
        browser.wait(ExpectedConditions.visibilityOf(auditProgress.getBin()), 5000);
        auditProgress.getBin().click();
        browser.wait(ExpectedConditions.visibilityOf(auditProgress.getCheckMark()), 5000);
        auditProgress.getCheckMark().click();
        browser.wait(ExpectedConditions.visibilityOf(auditProgress.getSubmitBin()), 5000);
        auditProgress.getSubmitBin().click();
        browser.wait(ExpectedConditions.visibilityOf(auditProgress.getDismissButton()), 5000);
        auditProgress.getDismissButton().click();
    });

    it('Confirms the item is now presented under Completed Items tab', () => {
        browser.wait(ExpectedConditions.visibilityOf(auditProgress.getCompletedItemsButton()), 5000);
        auditProgress.getCompletedItemsButton().click();
        browser.wait(ExpectedConditions.visibilityOf(auditProgress.getCompletedItems()), 5000);
        expect(auditProgress.getCompletedItems().isDisplayed()).toBeTruthy();
        browser.refresh();
    });
});
