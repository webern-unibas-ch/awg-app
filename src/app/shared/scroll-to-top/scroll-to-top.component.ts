import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';

import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

/**
 * The ScrollToTop component.
 *
 * It contains the scroll-to-top button
 * that is provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-scroll-to-top',
    templateUrl: './scroll-to-top.component.html',
    styleUrl: './scroll-to-top.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class ScrollToTopComponent {
    /**
     * Public variable: faArrowUp.
     *
     * It instantiates fontawesome's faArrowUp icon.
     */
    faArrowUp = faArrowUp;

    /**
     * Public variable: isScrolled.
     *
     * It keeps track of the visibility of the scroll-to-top button.
     */
    isScrolled: boolean;

    /**
     * HostListener: checkScroll.
     *
     * It checks the scroll position on the document and
     * sets the visibility of the scroll-to-top button.
     */
    @HostListener('window:scroll', ['$event']) checkScroll(event: Event) {
        const window = event.currentTarget as Window;
        const scrollPosition = window.scrollY || 0;
        const SCROLL_THRESHOLD = 300;

        this.isScrolled = scrollPosition >= SCROLL_THRESHOLD;
    }

    /**
     * Public method: scrollToTop.
     *
     * It scrolls to the top of the page.
     *
     * @returns {void} Scrolls to the top of the page.
     */
    scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
