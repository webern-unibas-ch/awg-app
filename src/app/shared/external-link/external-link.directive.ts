import { isPlatformBrowser } from '@angular/common';
import { computed, Directive, inject, input, PLATFORM_ID } from '@angular/core';

/**
 * The external link directive.
 *
 * It catches links with href attributes and
 * adds specific attributes if href has an external target.
 */
@Directive({
    selector: 'a[href]',
    host: {
        '[attr.href]': 'href()',
        '[attr.target]': 'isExternal() ? "_blank" : null',
        '[attr.rel]': 'isExternal() ? "noopener noreferrer" : null',
    },
})
export class ExternalLinkDirective {
    /**
     * Private readonly injection variable: _platformId.
     *
     * It keeps the instance of the injected Angular PLATFORM_ID.
     */
    private readonly _platformId = inject(PLATFORM_ID);

    /**
     * Readonly input signal: href.
     *
     * It holds the href value of a link.
     */
    readonly href = input.required<string>();

    /**
     * Protected computed signal: isExternal.
     *
     * It checks if the href value is an external link.
     *
     * @returns {boolean} True if href is an external link, false otherwise.
     */
    protected isExternal = computed((): boolean => {
        const url = this.href();
        if (!url || !isPlatformBrowser(this._platformId)) {
            return false;
        }
        return !url.includes(location.hostname);
    });
}
