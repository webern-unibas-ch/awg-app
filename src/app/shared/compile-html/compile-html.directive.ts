import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { EditionGlyphService } from '@awg-app/views/edition-view/services';

import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

/**
 * The CompileHtmlDirective.
 *
 * It compiles and renders HTML content in the host element.
 * It also emits events for clicks on specific elements within the compiled HTML.
 */
@Directive({
    selector: '[awgCompileHtml]',
    host: {
        '(click)': 'onHostClick($event)',
        '(keydown)': 'onHostKeydown($event)',
    },
    standalone: true,
})
export class CompileHtmlDirective {
    /**
     * Private readonly injection variable: _el
     *
     * It keeps the instance of the injected ElementRef.
     */
    private readonly _el = inject(ElementRef);

    /**
     * Private readonly injection variable: _renderer
     *
     * It keeps the instance of the injected Renderer2.
     */
    private readonly _renderer = inject(Renderer2);

    /**
     * Private readonly injection variable: _glyphService
     *
     * It keeps the instance of the injected EditionGlyphService.
     */
    private readonly _glyphService = inject(EditionGlyphService);

    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Readonly input signal: htmlContent.
     *
     * It keeps the HTML content to be compiled and rendered.
     */
    readonly htmlContent = input<string>('', { alias: 'awgCompileHtml' });

    /**
     * The constructor of the CompileHtmlDirective.
     *
     * It sets up the effect to update the innerHTML of the host element.
     */
    constructor() {
        effect(() => {
            let content = this.htmlContent() || '';

            content = this._replaceGlyphPlaceholders(content);

            this._renderer.setProperty(this._el.nativeElement, 'innerHTML', content);

            this._applyAccessibilityAttributes();
        });
    }

    /**
     * Protected method: onHostClick.
     *
     * It handles click events on the host element.
     *
     * @param {MouseEvent} event The click event.
     * @returns {void} Calls the appropriate handler methods based on the target element.
     */
    protected onHostClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        this._handleInteraction(target, event);
    }

    /**
     * Protected method: onHostKeydown.
     *
     * It handles keydown events on the host element for Enter and Space keys.
     *
     * @param {KeyboardEvent} event The keydown event.
     * @returns {void} Calls the appropriate handler methods based on the target element.
     */
    protected onHostKeydown(event: KeyboardEvent): void {
        const target = event.target as HTMLElement;

        if (event.key === 'Enter' || event.key === ' ') {
            this._handleInteraction(target, event);
        }
    }

    /**
     * Private method: _applyAccessibilityAttributes.
     *
     * It finds all dynamic edition links inside the host element and applies
     * tabindex and role attributes for better accessibility and keyboard navigation.
     *
     * @returns {void} Applies the attributes directly to the DOM elements.
     */
    private _applyAccessibilityAttributes(): void {
        const selectors = 'a[data-complex-id], a[data-intro-fragment-id], a[data-sheet-id], a[data-report-fragment-id]';
        const anchors = this._el.nativeElement.querySelectorAll(selectors);

        anchors.forEach((anchor: HTMLAnchorElement) => {
            this._renderer.setAttribute(anchor, 'tabindex', '0');
            this._renderer.setAttribute(anchor, 'role', 'link');
        });
    }

    /**
     * Private method: _handleInteraction.
     *
     * It handles click and keydown events on the host element and calls the appropriate handler methods.
     *
     * @param {HTMLElement} target The target element of the event.
     * @param {Event} event The click or keydown event.
     * @returns {void} Calls the appropriate handler methods based on the target element.
     */
    private _handleInteraction(target: HTMLElement, event: Event): void {
        const anchor = target.closest('a');
        if (anchor) {
            this._handleAnchorNavigation(anchor, event);
            return;
        }

        const img = target.closest('img');
        if (img) {
            this._handleImageNavigation(img, event);
        }
    }

    /**
     * Private method: _handleAnchorNavigation.
     *
     * It handles click events on anchor elements and calls the appropriate navigation methods from the EditionNavigationService.
     *
     * @param {HTMLAnchorElement} anchor The clicked anchor element.
     * @param {Event} event The click event.
     * @returns {void} Calls the appropriate navigation methods based on the clicked anchor element.
     */
    private _handleAnchorNavigation(anchor: HTMLAnchorElement, event: Event): void {
        const complexId = anchor.getAttribute('data-complex-id') || '';

        const introFragmentId = anchor.getAttribute('data-intro-fragment-id');
        if (introFragmentId) {
            event.preventDefault();
            this._navigationService.navigateToIntroFragment({ complexId, fragmentId: introFragmentId });
            return;
        }

        if (complexId) {
            const sheetId = anchor.getAttribute('data-sheet-id');
            if (sheetId) {
                event.preventDefault();
                this._navigationService.navigateToSvgSheet({ complexId, sheetId });
                return;
            }

            const reportFragmentId = anchor.getAttribute('data-report-fragment-id');
            if (reportFragmentId) {
                event.preventDefault();
                this._navigationService.navigateToReportFragment({ complexId, fragmentId: reportFragmentId });
                return;
            }
        }
    }

    /**
     * Private method: _handleImageNavigation.
     *
     * It handles click events on image elements and calls the appropriate navigation methods from the EditionNavigationService.
     *
     * @param {HTMLImageElement} img The clicked image element.
     * @param {Event} event The click event.
     * @returns {void} Calls the appropriate navigation methods based on the clicked image element.
     */
    private _handleImageNavigation(img: HTMLImageElement, event: Event): void {
        if (!img.hasAttribute('data-snippet-id') || !img.hasAttribute('data-snippet-src')) {
            return;
        }

        event.preventDefault();
        const src = img.getAttribute('data-snippet-src');
        const id = img.getAttribute('data-snippet-id');

        // TODO: Handling of snippets
        // This._navigationService.openSnippet(src, id);
        console.log('Snippet öffnen:', { src, id });
    }

    /**
     * Private method: _replaceGlyphPlaceholders.
     *
     * It replaces placeholders in the content with the corresponding glyphs from the EditionGlyphService.
     *
     * @param {string} content The HTML content to be processed.
     * @returns {string} The processed content with glyph placeholders replaced.
     */
    private _replaceGlyphPlaceholders(content: string): string {
        if (!content.includes('ref.getGlyph')) {
            return content;
        }
        const regex = /\{\{ref\.getGlyph\('([^']+)'\)\}\}/g;
        return content.replace(regex, (_, glyphString) => this._glyphService.getGlyph(glyphString));
    }
}
