import {by, element, ElementFinder} from 'protractor';

export class AuditAssigned {

    getAudit(): ElementFinder {
        return element(by.id('auditItem9'));
    }

    getBin(): ElementFinder {
        return element(by.id('binItemC69'));
    }

    getFlagButton(): ElementFinder {
        return element(by.id('flag12731370'));
    }

    getFlagChecked(): ElementFinder {
        return element(by.css('ion-checkbox[formcontrolname="flagged"]'));
    }

    getSubmitButton(): ElementFinder {
        return element(by.id('validateButton'));
    }

    getDismissButton(): ElementFinder {
        return element(by.className('alert-button-inner sc-ion-alert-md'));
    }

    getCompletedItemsButton(): ElementFinder {
        return element(by.id('completedItemsButton'));
    }

    getCompletedItems(): ElementFinder {
        return element(by.id('completedItems12731370'));
    }
}
