import { booleanAttribute, Directive, ElementRef, inject, input, output } from '@angular/core';

/**
 * Constant: NATIVE_ACTIVATION_SELECTOR.
 *
 * It keeps the css selector of the elements that the browser activates itself
 * on the keyboard (by a synthesized click on Enter or Space).
 */
const NATIVE_ACTIVATION_SELECTOR = 'button, a[href], area[href], input, select, textarea, summary';

/**
 * Function: isLinkElement.
 *
 * It checks if a given element is a link (`<a>` or `role="link"`).
 *
 * @param {Element} element The given element.
 * @returns {boolean} The boolean value of the check result.
 */
function isLinkElement(element: Element): boolean {
    return element.tagName.toLowerCase() === 'a' || element.getAttribute('role') === 'link';
}

/**
 * The click directive.
 *
 * It emits a click on its host element also for the keyboard:
 * on click, on the Enter key and (except for links) on the Space key.
 *
 * Following the ARIA semantics, links (`<a>` or `role="link"`) are only activated
 * by the Enter key, so the Space key is disabled for them by default.
 *
 * The keyboard is only emulated for targets that the browser does not activate itself
 * (e.g., `<div>`, `<a>` without `href` or svg groups). Native controls and links with `href`
 * (as host, as delegated target or as ancestor of the target within the host)
 * emit only once through their synthesized click.
 */
@Directive({
    selector: '[awgClick]',
    host: {
        '(click)': 'awgClick.emit($event)',
        '(keydown.enter)': 'onEnter($event)',
        '(keydown.space)': 'onSpace($event)',
    },
})
export class ClickDirective {
    /**
     * Private readonly injection variable: _hostElement.
     *
     * It keeps the host element of the directive.
     */
    private readonly _hostElement: Element = inject(ElementRef).nativeElement;

    /**
     * Readonly input signal: clickOnSpace.
     *
     * It holds a boolean flag if the Space key emits a click.
     * @default true (false for links)
     */
    readonly clickOnSpace = input(!isLinkElement(this._hostElement), { transform: booleanAttribute });

    /**
     * Readonly output signal: awgClick.
     *
     * It emits the click or keydown event that activated the host element.
     */
    readonly awgClick = output<Event>();

    /**
     * Public method: onEnter.
     *
     * It emits a keydown of the Enter key as click,
     * unless the browser activates the target itself.
     *
     * @param {Event} event The given keydown event.
     * @returns {void} Emits the click.
     */
    onEnter(event: Event): void {
        if (!this._hasNativeActivation(event.target)) {
            this.awgClick.emit(event);
        }
    }

    /**
     * Public method: onSpace.
     *
     * It emits a keydown of the Space key as click, if enabled
     * and unless the browser activates the target itself.
     *
     * @param {Event} event The given keydown event.
     * @returns {void} Emits the click.
     */
    onSpace(event: Event): void {
        if (this.clickOnSpace() && !this._hasNativeActivation(event.target)) {
            this.awgClick.emit(event);
        }
    }

    /**
     * Private method: _hasNativeActivation.
     *
     * It checks if a given event target is, or lies within, an element that the browser activates itself
     * on the keyboard. Only ancestors within the host element are considered.
     *
     * @param {EventTarget | null} target The given event target.
     * @returns {boolean} The boolean value of the check result.
     */
    private _hasNativeActivation(target: EventTarget | null): boolean {
        const nativeElement = target instanceof Element ? target.closest(NATIVE_ACTIVATION_SELECTOR) : null;

        // `contains` includes the host element itself
        return !!nativeElement && this._hostElement.contains(nativeElement);
    }
}
