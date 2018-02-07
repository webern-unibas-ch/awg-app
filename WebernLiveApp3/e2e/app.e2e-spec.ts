import { WebernLiveApp3Page } from './app.po';

describe('webern-live-app3 App', () => {
  let page: WebernLiveApp3Page;

  beforeEach(() => {
    page = new WebernLiveApp3Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
