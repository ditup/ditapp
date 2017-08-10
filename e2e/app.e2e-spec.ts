import { browser, element, by } from 'protractor';

describe('DitUp App', function() {

  it('should show main page for visitors', () => {
    browser.get('/');
    const mainTitle = element(by.css('.app-url')).getText();
    expect(mainTitle).toEqual('ditup.org');
  });
});
