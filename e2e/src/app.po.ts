import { browser, by, element } from 'protractor';

export class AwgAppPage {
    async navigateTo(): Promise<unknown> {
        return browser.get(browser.baseUrl);
    }

    async getTitleText(): Promise<string> {
        return element(by.css('app-root h1')).getText();
    }
}
