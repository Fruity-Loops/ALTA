import { by, element, ElementFinder } from 'protractor';

// Navigation through the SIDE MENU
export class Navigation {

    home(): ElementFinder {
        return element(by.id('alta_logo'));
    }

    manageOrganizationOption(): ElementFinder {
        return element(by.cssContainingText(
            '.option-tab',
            'Manage Organizations'
            )
        );
    }

    manageMembersOption(): ElementFinder {
        return element(by.cssContainingText(
            '.option-tab',
            'Manage Members')
            );
    }

    settingsOption(): ElementFinder {
        return element(by.cssContainingText(
            '.option-tab',
            'Settings')
            );
    }
}
