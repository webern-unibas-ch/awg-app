import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { SourceDescWritingMaterial } from '@awg-views/edition-view/models/source-desc.model';

import { getDimensions, getSystems } from '../source-desc-writing-materials.utils';
import { SourceDescWritingTrademarkComponent } from '../trademark/source-desc-writing-trademark.component';
import { SourceDescWritingWatermarkComponent } from '../watermark/source-desc-writing-watermark.component';

/**
 * The SourceDescWritingMaterial component.
 *
 * It contains a single writing material of the source description
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-writing-material',
    templateUrl: './source-desc-writing-material.component.html',
    styleUrl: './source-desc-writing-material.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SourceDescWritingTrademarkComponent, SourceDescWritingWatermarkComponent],
})
export class SourceDescWritingMaterialComponent {
    /**
     * Readonly input signal: material.
     *
     * It holds the writing material data.
     */
    readonly material = input.required<SourceDescWritingMaterial>();

    /**
     * Readonly computed signal: materialType.
     *
     * It holds the type of the writing material, or an empty string.
     */
    readonly materialType = computed<string>(() => this.material().materialType || '');

    /**
     * Readonly computed signal: systems.
     *
     * It holds the string representation of the systems of the writing material.
     */
    readonly systems = computed<string>(() => getSystems(this.material().systems));

    /**
     * Readonly computed signal: dimensions.
     *
     * It holds the string representation of the dimensions of the writing material.
     */
    readonly dimensions = computed<string>(() => getDimensions(this.material().dimensions));

    /**
     * Readonly computed signal: folioAddendum.
     *
     * It holds the folio addendum of the writing material, or an empty string.
     */
    readonly folioAddendum = computed<string>(() => this.material().folioAddendum || '');
}
