import { by, element, ElementFinder } from 'protractor';

export class Navigation {

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
