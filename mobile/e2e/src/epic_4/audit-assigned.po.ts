import {by, element, ElementFinder} from 'protractor';

export class AuditAssigned {
    getBellIcon(): ElementFinder {
        return element(by.id('bellIcon'));
    }

    getNotificationValue(): ElementFinder {
        return element(by.id('bellNotificationValue'));
    }

    getNewAuditAssigned(): ElementFinder {
        return element(by.id('newAudit9'));
    }

    getauditValueList(): ElementFinder {
        return element(by.id('audit9'));
    }

    getAlertIconList(): ElementFinder {
        return element(by.id('alertIcon9'));
    }
}
