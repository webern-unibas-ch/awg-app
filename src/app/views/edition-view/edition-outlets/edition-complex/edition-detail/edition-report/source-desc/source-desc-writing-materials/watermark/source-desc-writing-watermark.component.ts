import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { SourceDescriptionWritingMaterialWatermark } from '@awg-views/edition-view/models/source-description.model';

import { getItemLocus } from '../source-desc-writing-materials.utils';

/**
 * The SourceDescWritingWatermark component.
 *
 * It contains the watermark of a writing material of the source description
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-writing-watermark',
    templateUrl: './source-desc-writing-watermark.component.html',
    styleUrl: './source-desc-writing-watermark.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CompileHtmlDirective],
})
export class SourceDescWritingWatermarkComponent {
    /**
     * Readonly input signal: watermark.
     *
     * It holds the watermark data of the writing material.
     */
    readonly watermark = input<SourceDescriptionWritingMaterialWatermark | undefined>();

    /**
     * Readonly computed signal: variant.
     *
     * It holds the variant of the watermark, or an empty string.
     */
    readonly variant = computed<string>(() => this.watermark()?.variant || '');

    /**
     * Readonly computed signal: hasWatermark.
     *
     * It checks whether the watermark has a variant.
     */
    readonly hasWatermark = computed<boolean>(() => !!this.variant());

    /**
     * Readonly computed signal: loci.
     *
     * It holds the formatted loci of the watermark, or an empty array.
     */
    readonly loci = computed<string[]>(() => (this.watermark()?.locus ?? []).map(getItemLocus));
}
