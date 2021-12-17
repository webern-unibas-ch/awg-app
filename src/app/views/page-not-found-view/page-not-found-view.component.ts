import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AppConfig } from '@awg-app/app.config';

/**
 * The PageNotFoundView component.
 *
 * It contains the page not found view section of the app
 * with redirects to awg contact pages.
 */
@Component({
    selector: 'awg-page-not-found-view',
    templateUrl: './page-not-found-view.component.html',
    styleUrls: ['./page-not-found-view.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundViewComponent {
    /**
     * Public variable: pageNotFoundTitle.
     *
     * It keeps the title of the page not found section.
     */
    pageNotFoundTitle = 'Entschuldigung, diese Seite gibt es hier nicht…';

    /**
     * Public variable: pageNotFoundSubTitle.
     *
     * It keeps the subtitle of the page not found section.
     */
    pageNotFoundSubTitle = '… aber möglicherweise können wir Ihnen anders weiterhelfen?';

    /**
     * Private variable: _pageNotFoundImgPath.
     *
     * It keeps the path to the image of the page not found section.
     */
    private _pageNotFoundImgPath = 'assets/img/page-not-found/Webern_Books.jpg';

    /**
     * Private variable: _awgContactUrl.
     *
     * It keeps the url to the contact page of the Webern project homepage.
     */
    private _awgContactUrl = AppConfig.AWG_PROJECT_URL + 'index.php?id=41';

    /**
     * Getter for the path to the image of the page not found section.
     *
     * @returns {string} The path to the image of the page not found section.
     */
    get pageNotFoundImgPath(): string {
        return this._pageNotFoundImgPath;
    }

    /**
     * Getter for the URL of the contact page of the AWG project website
     * ({@link https://anton-webern.ch/index.php?id=41}).
     *
     * @returns {string} The url of the contact page of the AWG project website.
     */
    get awgContactUrl(): string {
        return this._awgContactUrl;
    }
}
