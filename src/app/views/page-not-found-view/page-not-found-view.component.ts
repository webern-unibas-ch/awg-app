import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AppConfig } from '@awg-app/app.config';
import { ExternalLinkDirective } from '@awg-shared/external-link/external-link.directive';
import { HeadingComponent } from '@awg-shared/heading/heading.component';

/**
 * The PageNotFoundView component.
 *
 * It contains the page not found view of the app
 * with redirects to the AWG contact pages.
 */
@Component({
    selector: 'awg-page-not-found-view',
    templateUrl: './page-not-found-view.component.html',
    styleUrls: ['./page-not-found-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [HeadingComponent, ExternalLinkDirective, RouterLink, RouterLinkActive],
})
export class PageNotFoundViewComponent {
    /**
     * Public variable: PAGE_NOT_FOUND_VIEW_ID.
     *
     * It keeps the id for the heading component
     * of the page not found view.
     */
    readonly PAGE_NOT_FOUND_VIEW_ID = 'awg-page-not-found-view-heading';

    /**
     * Public readonly variable: PAGE_NOT_FOUND_VIEW_TITLE.
     *
     * It keeps the title for the heading component
     * of the page not found view.
     */
    readonly PAGE_NOT_FOUND_VIEW_TITLE = 'Entschuldigung, diese Seite gibt es hier nicht…';

    /**
     * Public readonly variable: PAGE_NOT_FOUND_VIEW_SUBTITLE.
     *
     * It keeps the subtitle of the page not found.
     */
    readonly PAGE_NOT_FOUND_VIEW_SUBTITLE = '… aber möglicherweise können wir Ihnen anders weiterhelfen?';

    /**
     * Public readonly variable: PAGE_NOT_FOUND_VIEW_IMG_PATH.
     *
     * It keeps the path to the image of the page not found view.
     */
    readonly PAGE_NOT_FOUND_VIEW_IMG_PATH = 'assets/img/page-not-found/Webern_Books.jpg';

    /**
     * Public readonly variable: AWG_CONTACT_URL.
     *
     * It keeps the url to the contact page of the Webern project homepage.
     */
    readonly AWG_CONTACT_URL = AppConfig.AWG_PROJECT_URL + 'de/info/kontakt.html';
}
