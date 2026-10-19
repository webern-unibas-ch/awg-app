import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

import { ExternalLinkDirective } from '@awg-shared/external-link/external-link.directive';

/**
 * The ContactMap component.
 *
 * It contains an iframe with a map.
 */
@Component({
    selector: 'awg-contact-map',
    templateUrl: './contact-map.component.html',
    styleUrls: ['./contact-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ExternalLinkDirective],
})
export class ContactMapComponent {
    /**
     * Readonly input signal: embedUrl.
     *
     * It holds the sanitized link to embed the map.
     */
    readonly embedUrl = input.required<SafeResourceUrl>();

    /**
     * Readonly input signal: linkUrl.
     *
     * It holds the direct link to the external map page.
     */
    readonly linkUrl = input.required<string>();

    /**
     * Public readonly variable: linkLabel.
     *
     * It keeps a label for the map link.
     */
    readonly linkLabel = 'Größere Karte anzeigen';

    /**
     * Public readonly object: iframeSettings.
     *
     * It holds the static dimensions for the map iframe.
     */
    readonly iframeSettings = {
        width: '100%',
        height: '350',
    } as const;
}
