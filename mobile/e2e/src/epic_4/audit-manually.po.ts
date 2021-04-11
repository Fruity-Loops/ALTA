import {by, element, ElementFinder} from 'protractor';

export class AuditManually {

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

    getFlag(): ElementFinder {
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

    getCompletedManualItems(): ElementFinder {
        return element(by.id('completedItems123456789'));
    }
}
