import { WebernLiveApp2Page } from './app.po';

describe('webern-live-app2 App', () => {
  let page: WebernLiveApp2Page;

  beforeEach(() => {
    page = new WebernLiveApp2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
