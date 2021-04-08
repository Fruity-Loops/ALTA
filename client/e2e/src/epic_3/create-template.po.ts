import {by, element, ElementFinder} from 'protractor';

export class CreateAuditTemplate {

  getaddTemplateButton(): ElementFinder {
    return element(by.id('addTemplateButton'));
  }

  getEditButton(): ElementFinder {
    return element(by.id('editButton'));
  }

  getTitleField(): ElementFinder {
    return element(by.id('title'));
  }

  getLocationField(): ElementFinder {
    return element(by.id('location'));
  }

  getPlantField(): ElementFinder {
    return element(by.id('plant'));
  }

  getZonesField(): ElementFinder {
    return element(by.id('zone'));
  }

  getAisleField(): ElementFinder {
    return element(by.id('aisle'));
  }

  getBinsField(): ElementFinder {
    return element(by.id('bin'));
  }

  getPartField(): ElementFinder {
    return element(by.id('partNumber'));
  }

  getSerialField(): ElementFinder {
    return element(by.id('serialNumber'));
  }

  getLocationFieldButton(): ElementFinder {
    return element(by.id('locationButton'));
  }

  getPlantFieldButton(): ElementFinder {
    return element(by.id('plantButton'));
  }

  getZonesFieldButton(): ElementFinder {
    return element(by.id('zoneButton'));
  }

  getAisleFieldButton(): ElementFinder {
    return element(by.id('aisleButton'));
  }

  getBinsFieldButton(): ElementFinder {
    return element(by.id('binButton'));
  }

  getPartFieldButton(): ElementFinder {
    return element(by.id('partNumberButton'));
  }

  getSerialFieldButton(): ElementFinder {
    return element(by.id('serialNumberButton'));
  }

  getDescriptionField(): ElementFinder {
    return element(by.id('description'));
  }

  getCreateButton(): ElementFinder {
    return element(by.id('create-template-button'));
  }

  getTemplateID(): ElementFinder {
    return element(by.id('Testing Template'));
  }
}
