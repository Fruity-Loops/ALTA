import {browser, by, element, ElementFinder} from 'protractor';

export class GreetingPage {
    navigateTo(): Promise<unknown> {
        return browser.get(browser.baseUrl) as Promise<unknown>;
    }

    getEmailInputField(): ElementFinder {
        return element(by.name('ion-input-0'));
    }

    getSendPinButton(): ElementFinder {
        return element(by.id('signinButton'));
    }

    getPasswordInputField(): ElementFinder {
        return element(by.name('ion-input-1'));
    }

    getLoginButton(): ElementFinder {
        return element(by.id('loginButton'));
    }

    getProfileButton(): ElementFinder {
        return element(by.id('profileButton'));
    }

    getlogoutButton(): ElementFinder {
        return element(by.id('logout'));
    }

}
