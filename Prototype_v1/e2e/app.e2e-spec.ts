import { AwgAppPage } from './app.po';

describe('awg-app App', () => {
    let page: AwgAppPage;

    beforeEach(() => {
        page = new AwgAppPage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
