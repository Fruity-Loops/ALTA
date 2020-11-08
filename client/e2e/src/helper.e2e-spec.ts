import { browser, logging } from 'protractor';

// Specify global blocks for all tests

afterEach(async () => {
  browser.sleep(1000); // Slow down time between tests

  // Assert that there are no errors emitted from the browser
  const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  expect(logs).not.toContain(jasmine.objectContaining({
    level: logging.Level.SEVERE,
  } as logging.Entry));
});

