import { isPlatformBrowser } from '@angular/common';
import { Directive, HostBinding, Inject, Input, OnChanges, PLATFORM_ID } from '@angular/core';

/**
 * The external link directive.
 *
 * It catches links with href attributes and
 * adds specific attributes if href has an external target.
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
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
     * Constructor of the ExternalLinkDirective.
     *
     * It declares and injects a private instance of the Angular PLATFORM_ID.
     *
     * @param {PLATFORM_ID} platformId Instance of the Angular PLATFORM_ID.
     */
    constructor(@Inject(PLATFORM_ID) private platformId: string) {}

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
        return isPlatformBrowser(this.platformId) && !this.href.includes(location.hostname);
    }
}
