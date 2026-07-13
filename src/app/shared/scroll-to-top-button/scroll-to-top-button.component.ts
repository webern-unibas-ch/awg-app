import { ChangeDetectionStrategy, Component, DOCUMENT, inject, signal } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

/**
 * The ScrollToTopButton component.
 *
 * It contains the scroll-to-top button.
 */
@Component({
    selector: 'awg-scroll-to-top-button',
    templateUrl: './scroll-to-top-button.component.html',
    styleUrls: ['./scroll-to-top-button.component.scss'],
    host: {
        '(window:scroll)': 'onWindowScroll()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent],
})
export class ScrollToTopButtonComponent {
    /**
     * Private readonly injection variable: _document.
     *
     * It keeps the instance of the injected DOCUMENT.
     */
    private readonly _document = inject(DOCUMENT);

    /**
     * Readonly signal: isScrolled.
     *
     * It holds the visibility state of the scroll-to-top button.
     */
    readonly showScrollButton = signal<boolean>(false);

    /**
     * Readonly variable: faArrowUp.
     *
     * It instantiates fontawesome's faArrowUp icon.
     */
    readonly faArrowUp = faArrowUp;

    /**
     * Protected method: onWindowScroll.
     *
     * It monitors the window scroll position to update
     * the visibility of the scroll-to-top button.
     *
     * @returns {void} Updates the visibility of the scroll-to-top button.
     */
    protected onWindowScroll(): void {
        const windowRef = this._document.defaultView;
        const scrollPosition = windowRef?.scrollY || 0;
        const SCROLL_THRESHOLD = 300;

        this.showScrollButton.set(scrollPosition >= SCROLL_THRESHOLD);
    }

    /**
     * Protected method: scrollToTop.
     *
     * It scrolls the window smoothly back to the top of the page.
     *
     * @returns {void} Scrolls to the top of the page.
     */
    protected scrollToTop(): void {
        this._document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
