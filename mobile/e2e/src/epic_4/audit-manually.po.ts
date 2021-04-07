import {by, element, ElementFinder} from 'protractor';

export class AuditAssigned {

    getAudit(): ElementFinder {
        return element(by.id('auditItem9'));
    }

    getBin(): ElementFinder {
        return element(by.id('binItemC69'));
    }

    getInputButton(): ElementFinder {
        return element(by.id('manualInputButton'));
    }

    getInputField(): ElementFinder {
        return element(by.id('barCodeNumberField'));
    }

    getConfirmButton(): ElementFinder {
        return element(by.className('confirmButton'));
    }

    getaddAsNewButton(): ElementFinder {
        return element(by.className('addAsNewButton'));
    }

    getQuantityField(): ElementFinder {
        return element(by.css('ion-input[formcontrolname="Quantity"] input'));
    }

    getSubmitButton(): ElementFinder {
        return element(by.id('validateButton'));
    }

    getDismissButton(): ElementFinder {
        return element(by.className('alert-button-inner sc-ion-alert-md'));
    }

    getCompeletedItemsButton(): ElementFinder {
        return element(by.id('completedItemsButton'));
    }

    getCompeletedManualItems(): ElementFinder {
        return element(by.id('completedItems123456789'));
    }
}
