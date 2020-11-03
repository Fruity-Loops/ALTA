import { GreetingPage } from './greeting.po';
import { browser, logging } from 'protractor';

describe('E2E Greeting Page', () => {
  let page: GreetingPage;

  beforeEach(() => {
    page = new GreetingPage();
  });

  it('should render login form', () => {
    page.navigateTo();
    expect(page.getLoginForm()).toBeTruthy();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
