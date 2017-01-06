import { browser, element, by } from 'protractor';

export class WebernLiveApp2Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('awg-root h1')).getText();
  }
}
