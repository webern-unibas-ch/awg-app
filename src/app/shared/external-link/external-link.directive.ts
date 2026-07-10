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
        '[attr.rel]': 'resolvedRel()',
        '[class.awg-external-link]': 'isExternal()',
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
     * Readonly input signal: rel.
     *
     * It holds the (optional) existing rel value of a link.
     * @default ''
     */
    readonly rel = input<string>('');

    /**
     * Protected computed signal: isExternal.
     *
     * It checks if the href value is an external link.
     *
     * @returns {boolean} True if href is an external link, false otherwise.
     */
    protected isExternal = computed<boolean>(() => {
        const url = this.href()?.trim();
        if (!url || !isPlatformBrowser(this._platformId)) {
            return false;
        }

        try {
            const currentOrigin = location.origin;
            const linkUrl = new URL(url, currentOrigin);
            const isHttp = linkUrl.protocol === 'http:' || linkUrl.protocol === 'https:';

            return isHttp && linkUrl.origin !== currentOrigin;
        } catch {
            return false;
        }
    });

    /**
     * Protected computed signal: resolvedRel.
     *
     * It merges existing rel inputs with security attributes ('noopener noreferrer')
     * for external links, or returns the original rel value for internal links.
     *
     * @returns {string | null} The resolved rel value or null if not applicable.
     */
    protected resolvedRel = computed<string | null>(() => {
        const baseRel = this.rel();

        if (!this.isExternal()) {
            return baseRel || null;
        }

        const relParts = new Set(baseRel.split(/\s+/).filter(Boolean));
        relParts.add('noopener');
        relParts.add('noreferrer');

        return Array.from(relParts).join(' ');
    });
}
