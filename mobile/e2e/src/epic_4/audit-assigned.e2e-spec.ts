import { AuditAssigned } from './audit-assigned.po';
import { Login, Logout } from '../login.po';

describe('Test Login', () => {

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

    it('should click on Logo to ensure the user has logged in', () => {
        auditAssigned.getLogo().click();
    });


});
