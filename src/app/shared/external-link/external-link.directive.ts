import { Directive, HostBinding, Inject, Input, OnChanges, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: 'a[href]'
})
export class ExternalLinkDirective implements OnChanges {
    @HostBinding('attr.href') hrefAttr = '';
    @HostBinding('attr.target') targetAttr = '';
    @HostBinding('attr.rel') relAttr = '';
    @Input() href: string;

    constructor(@Inject(PLATFORM_ID) private platformId: string) {}

    ngOnChanges() {
        this.hrefAttr = this.href;

        if (this.isExternalLink()) {
            this.targetAttr = '_blank';
            this.relAttr = 'noopener noreferrer';
        }
    }

    private isExternalLink() {
        return isPlatformBrowser(this.platformId) && !this.href.includes(location.hostname);
    }
}
