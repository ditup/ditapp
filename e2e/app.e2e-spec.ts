import { browser, element, by } from 'protractor';

describe('DitUp App', function() {

  it('should show main page for visitors', () => {
    browser.get('/');
    let mainTitle = element(by.css('#content h1')).getText();
    expect(mainTitle).toEqual('ditup.org');
  });
});
