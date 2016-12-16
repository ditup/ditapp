import { DitappNgPage } from './app.po';

describe('ditapp-ng App', function() {
  let page: DitappNgPage;

  beforeEach(() => {
    page = new DitappNgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
