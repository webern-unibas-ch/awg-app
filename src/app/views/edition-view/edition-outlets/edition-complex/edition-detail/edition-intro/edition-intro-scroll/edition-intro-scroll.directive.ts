import { Directive, ElementRef, inject, Renderer2 } from '@angular/core';

/**
 * The EditionIntroScroll directive.
 *
 * It is used to handle the scroll event on the intro window.
 */
@Directive({
    selector: '[awgEditionIntroScroll]',
    host: {
        '(window:scroll)': 'onWindowScroll()',
    },
})
export class EditionIntroScrollDirective {
    /**
     * Private readonly injection variable: _el.
     *
     * It keeps the instance of the injected ElementRef.
     */
    private readonly _el = inject(ElementRef);

    /**
     * Private readonly injection variable: _renderer.
     *
     * It keeps the instance of the injected Renderer2.
     */
    private readonly _renderer = inject(Renderer2);

    /**
     * Private variable: _inThrottle.
     *
     * It is used to throttle the scroll event.
     */
    private _inThrottle = false;

    /**
     * Public method: onWindowScroll.
     *
     * It handles the scroll event on the intro window
     * and delegates the highlighting of the corresponding section in the intro navigation.
     *
     * @returns {void} Delegates the highlighting of the active section in the intro navigation
     * on window scroll.
     */
    onWindowScroll(): void {
        if (this._inThrottle) {
            return;
        }

        this._onIntroScroll();

        this._inThrottle = true;

        setTimeout(() => (this._inThrottle = false), 200);
    }

    /**
     * Private method: _onIntroScroll.
     *
     * It handles the scroll event on the intro window
     * and highlights the corresponding section in the intro navigation.
     *
     * @returns {void} Highlights the active section in the intro navigation
     * on window scroll.
     */
    private _onIntroScroll(): void {
        const container = this._el.nativeElement as HTMLElement;
        const scrollPosition = globalThis.scrollY || document.documentElement.scrollTop;

        const introSections = container.querySelectorAll<HTMLElement>('.awg-edition-intro-section');
        const introNavLinks = container.querySelectorAll<HTMLAnchorElement>('a.awg-edition-intro-nav-link');

        let activeId: string | null = null;

        introSections.forEach(section => {
            const top = section.offsetTop - 10;
            const bottom = section.offsetTop + section.offsetHeight;

            if (top <= scrollPosition && bottom > scrollPosition) {
                activeId = section.id;
            }
        });

        introNavLinks.forEach((navLink: HTMLAnchorElement) => {
            const activeHash = activeId ? `#${activeId}` : null;

            if (navLink.hash === activeHash) {
                this._renderer.addClass(navLink, 'active');
            } else {
                this._renderer.removeClass(navLink, 'active');
            }
        });
    }
}
