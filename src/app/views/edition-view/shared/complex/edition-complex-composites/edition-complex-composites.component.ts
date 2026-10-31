import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EditionOutlineCompositeComplexItem } from '@awg-views/edition-view/models/edition-outline.model';

/**
 * The EditionComplexComposites component.
 *
 * It contains the composite edition complexes of a part
 * together with the number of the part in them,
 * with links to the enabled composite complexes.
 */
@Component({
    selector: 'awg-edition-complex-composites',
    templateUrl: './edition-complex-composites.component.html',
    styleUrl: './edition-complex-composites.component.scss',
    imports: [RouterLink],
})
export class EditionComplexCompositesComponent {
    /**
     * Readonly input signal: compositeComplexes.
     *
     * It holds the outline items of the composite edition complexes of a part
     * with the number of the part in them.
     */
    readonly compositeComplexes = input.required<EditionOutlineCompositeComplexItem[]>();

    /**
     * Readonly input signal: isCompact.
     *
     * It holds the flag whether the composite complexes are labeled
     * by their short instead of their full complex ids.
     */
    readonly isCompact = input<boolean>(false);
}
