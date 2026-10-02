import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';

/**
 * The SourceDescContentFolioLabel component.
 *
 * It contains the source description content folio label
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-content-folio',
    templateUrl: './source-desc-content-folio.component.html',
    styleUrl: './source-desc-content-folio.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AbbrDirective],
})
export class SourceDescContentFolioComponent {
    /**
     * Readonly input signal: folioLabel.
     *
     * It holds the folio label.
     */
    readonly folioLabel = input.required<string>();

    /**
     * Readonly input signal: isPage.
     *
     * It indicates whether the folio label is a page.
     */
    readonly isPage = input<boolean>(false);

    /**
     * Readonly computed signal: hasFolioSuffix.
     *
     * It holds true if the label ends with 'v' or 'r'.
     */
    readonly hasFolioSuffix = computed<boolean>(() => {
        const label = this.folioLabel();
        return label.endsWith('v') || label.endsWith('r');
    });

    /**
     * Readonly computed signal: folioNumber.
     *
     * It holds the parsed number part of the folio.
     */
    readonly folioNumber = computed<string>(() =>
        this.hasFolioSuffix() ? this.folioLabel().slice(0, -1) : this.folioLabel()
    );

    /**
     * Readonly computed signal: folioSuffix.
     *
     * It holds the parsed suffix part of the folio.
     */
    readonly folioSuffix = computed<string>(() => (this.hasFolioSuffix() ? this.folioLabel().slice(-1) : ''));
}
