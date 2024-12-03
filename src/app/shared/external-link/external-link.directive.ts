import { isPlatformBrowser } from '@angular/common';
import { Directive, HostBinding, inject, Input, OnChanges, PLATFORM_ID } from '@angular/core';

/**
 * The external link directive.
 *
 * It catches links with href attributes and
 * adds specific attributes if href has an external target.
 */
@Directive({
    selector: 'a[href]',
})
export class ExternalLinkDirective implements OnChanges {
    /**
     * HostBinding: hrefAttr.
     *
     * It binds to a link's href attribute.
     */
    @HostBinding('attr.href') hrefAttr = '';

    /**
     * HostBinding: targetAttr.
     *
     * It binds to a link's target attribute.
     */
    @HostBinding('attr.target') targetAttr = '';

    /**
     * HostBinding: relAttr.
     *
     * It binds to a link's rel  attribute.
     */
    @HostBinding('attr.rel') relAttr = '';

    /**
     * Input variable: href.
     *
     * It keeps the href value of a link.
     */
    @Input() href: string;

    /**
     * Private readonly injection variable: _platformId.
     *
     * It keeps the instance of the injected Angular PLATFORM_ID.
     */
    private readonly _platformId = inject(PLATFORM_ID);

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     */
    ngOnChanges() {
        this.hrefAttr = this.href;

        if (this._isExternalLink()) {
            this.targetAttr = '_blank';
            this.relAttr = 'noopener noreferrer';
        }
    }

    /**
     * Private method: _isExternalLink.
     *
     * It detects if the app is running in the browser
     * and if value of href attribute is included in location.hostname.
     *
     * @returns {boolean} Sets the _isExternalLink flag.
     */
    private _isExternalLink(): boolean {
        return isPlatformBrowser(this._platformId) && !this.href.includes(location.hostname);
    }
}
