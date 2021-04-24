import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

/**
 * The OpenStreetMap component.
 *
 * It contains an iframe with an Open Street Map (osm)
 * that is provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-open-street-map',
    templateUrl: './open-street-map.component.html',
    styleUrls: ['./open-street-map.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenStreetMapComponent {
    /**
     * Input variable: osmEmbedUrl.
     *
     * It keeps the sanitized link to embed the OSM map.
     */
    @Input()
    osmEmbedUrl: SafeResourceUrl;

    /**
     * Input variable: osmLinkUrl.
     *
     * It keeps the sanitized link to the OSM page.
     */
    @Input()
    osmLinkUrl: string;

    /**
     * Public variable: osmLinkLabel.
     *
     * It keeps the label for the sanitized link to the OSM page.
     */
    osmLinkLabel = 'Größere Karte anzeigen';

    /**
     * Public variable: osmIFrameSettings.
     *
     * It keeps the settings for the OSM iframe.
     */
    osmIFrameSettings = {
        width: '100%',
        height: '350',
        scrolling: 'no',
    };
}
