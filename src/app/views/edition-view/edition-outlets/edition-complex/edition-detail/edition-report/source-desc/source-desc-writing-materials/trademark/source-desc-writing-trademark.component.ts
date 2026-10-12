import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { EditionRouteConstant } from '@awg-views/edition-view/edition-routes.constants';
import { SourceDescWritingMaterialTrademark } from '@awg-views/edition-view/models/source-desc.model';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';

import { getItemLocus, getTrademark } from '../source-desc-writing-materials.utils';

/**
 * The SourceDescWritingTrademark component.
 *
 * It contains the trademark of a writing material of the source description
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-writing-trademark',
    templateUrl: './source-desc-writing-trademark.component.html',
    styleUrl: './source-desc-writing-trademark.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CompileHtmlDirective],
})
export class SourceDescWritingTrademarkComponent {
    /**
     * Readonly input signal: trademark.
     *
     * It holds the trademark data of the writing material.
     */
    readonly trademark = input<SourceDescWritingMaterialTrademark | undefined>();

    /**
     * Readonly computed signal: hasTrademark.
     *
     * It checks whether the trademark has a variant or an alt text.
     */
    readonly hasTrademark = computed<boolean>(() => !!(this.trademark()?.variant || this.trademark()?.alt));

    /**
     * Readonly computed signal: variant.
     *
     * It holds the trademark constant for the variant of the trademark,
     * or null if no variant is given.
     */
    readonly variant = computed<EditionRouteConstant | null>(() => {
        const variant = this.trademark()?.variant;
        return variant ? getTrademark(variant) : null;
    });

    /**
     * Readonly computed signal: alt.
     *
     * It holds the alt text of the trademark, or an empty string.
     */
    readonly alt = computed<string>(() => this.trademark()?.alt || '');

    /**
     * Readonly computed signal: loci.
     *
     * It holds the formatted loci of the trademark, or an empty array.
     */
    readonly loci = computed<string[]>(() => (this.trademark()?.locus ?? []).map(getItemLocus));
}
