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
  
});
