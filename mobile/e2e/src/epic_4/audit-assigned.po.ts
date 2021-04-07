import { by, element, ElementFinder } from 'protractor';

export class AuditAssigned {
    getLogo(): ElementFinder {
        return element(by.className('alta-logo'));
    }
}
