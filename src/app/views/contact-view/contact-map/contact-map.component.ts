import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

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
})
export class ContactMapComponent {
    /**
     * Input signal: embedUrl.
     *
     * It holds the sanitized link to embed the map.
     */
    embedUrl = input.required<SafeResourceUrl>();

    /**
     * Input signal: linkUrl.
     *
     * It holds the direct link to the external map page.
     */
    linkUrl = input.required<string>();

    /**
     * Public readonly variable: LINK_LABEL.
     *
     * It keeps a label for the map link.
     */
    readonly LINK_LABEL = 'Größere Karte anzeigen';

    /**
     * Public readonly object: IFRAME_SETTINGS.
     *
     * It holds the static dimensions for the map iframe.
     */
    readonly IFRAME_SETTINGS = {
        width: '100%',
        height: '350',
    } as const;
}
