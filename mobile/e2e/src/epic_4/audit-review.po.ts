import {by, element, ElementFinder} from 'protractor';

export class AuditAssigned {
    getInfoButton(): ElementFinder {
        return element(by.id('infoButton9'));
    }

    getcompleteAuditField(): ElementFinder {
        return element(by.id('completedAudit'));
    }

    getitemLeftAuditField(): ElementFinder {
        return element(by.id('itemLeftAudit'));
    }

    getCompletionAuditField(): ElementFinder {
        return element(by.id('completionAudit'));
    }

    getAccuracyAuditField(): ElementFinder {
        return element(by.id('accuracyAudit'));
    }

    getClickOutside(): ElementFinder {
        return element(by.className('sc-ion-popover-md md hydrated'));
    }

    getAudit(): ElementFinder {
        return element(by.id('auditItem9'));
    }

    getInfoButtonBin(): ElementFinder {
        return element(by.id('infoButtonBinC69'));
    }

    getBin(): ElementFinder {
        return element(by.id('binItemC69'));
    }

    getCheckMark(): ElementFinder {
        return element(by.id('12731370'));
    }

    getSubmitBin(): ElementFinder {
        return element(by.id('validateButton'));
    }

    getDismissButton(): ElementFinder {
        return element(by.className('alert-button-inner sc-ion-alert-md'));
    }

    getCompeletedItemsButton(): ElementFinder {
        return element(by.id('completedItemsButton'));
    }

    getCompeletedItems(): ElementFinder {
        return element(by.id('completedItems12731370'));
    }
}
