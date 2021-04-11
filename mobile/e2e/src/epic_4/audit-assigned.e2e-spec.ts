import {AuditAssigned} from './audit-assigned.po';
import {Login, Logout} from '../login.po';
import {browser, ExpectedConditions} from 'protractor';

/**
 * https://github.com/fruity-loops/alta/issues/56
 */
describe('AT-4.1: New Audit Notification', () => {

    const auditAssigned: AuditAssigned = new AuditAssigned();

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

    it('Audit is shown on the screen', () => {
        browser.wait(ExpectedConditions.visibilityOf(auditAssigned.getAlertIconList()), 5000);
        expect(auditAssigned.getAlertIconList().isDisplayed()).toBeTruthy();
        auditAssigned.getauditValueList().getAttribute('Audit 9');
        auditAssigned.getNotificationValue().getAttribute('1');
    });

    it('Should click on the bell icon to select the newly assigned audit', () => {
        browser.wait(ExpectedConditions.visibilityOf(auditAssigned.getBellIcon()), 5000);
        auditAssigned.getBellIcon().click();
        browser.wait(ExpectedConditions.visibilityOf(auditAssigned.getNewAuditAssigned()), 5000);
        auditAssigned.getNewAuditAssigned().click();
    });
});
