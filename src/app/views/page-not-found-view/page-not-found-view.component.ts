import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { APP_CONSTANTS } from '@awg-app/app.constants';
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
     * Public variable: pageNotFoundViewId.
     *
     * It keeps the id for the heading component
     * of the page not found view.
     */
    readonly pageNotFoundViewId = 'awg-page-not-found-view-heading';

    /**
     * Public readonly variable: pageNotFoundViewTitle.
     *
     * It keeps the title for the heading component
     * of the page not found view.
     */
    readonly pageNotFoundViewTitle = 'Entschuldigung, diese Seite gibt es hier nicht…';

    /**
     * Public readonly variable: pageNotFoundViewSubtitle.
     *
     * It keeps the subtitle of the page not found.
     */
    readonly pageNotFoundViewSubtitle = '… aber möglicherweise können wir Ihnen anders weiterhelfen?';

    /**
     * Public readonly variable: pageNotFoundViewImgPath.
     *
     * It keeps the path to the image of the page not found view.
     */
    readonly pageNotFoundViewImgPath = 'assets/img/page-not-found/Webern_Books.jpg';

    /**
     * Public readonly variable: awgContactUrl.
     *
     * It keeps the url to the contact page of the Webern project homepage.
     */
    readonly awgContactUrl = APP_CONSTANTS.AWG_PROJECT_URL + 'de/info/kontakt.html';
}
