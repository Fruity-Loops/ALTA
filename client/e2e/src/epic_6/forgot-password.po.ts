import {by, element, ElementFinder} from 'protractor';

export class ResetPassword {

  getForgotCredentialsButton(): ElementFinder {
    return element(by.id('forgot-credentials'));
  }

  getEmailField(): ElementFinder {
    return element(by.id('emailAddress'));
  }

  getSubmitButton(): ElementFinder {
    return element(by.id('submitButton'));
  }

  getCloseButton(): ElementFinder {
    return element(by.id('closeButton'));
  }

  getLatestEmail(): ElementFinder {
    return element(by.xpath('(//*[contains(@id,"row_alta490")]/td[3])[1]'));
  }

  getTextButton(): ElementFinder {
    return element(by.xpath('//*[@id="pills-textbuthtml-tab"]'));
  }

  getResetLink(): ElementFinder {
    return element(by.xpath('/html/body/a'));
  }
}
