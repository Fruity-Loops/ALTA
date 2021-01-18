import { browser, by, element, ElementFinder } from 'protractor';

export class SideNav {
    getLogoutOption(): ElementFinder {
        return element(by.id('expandSideNav'));
    }

    getLogoutButton(): ElementFinder {
        return element(by.id('logoutbtn'));
    }
}