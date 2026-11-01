import { Component, input } from '@angular/core';

import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { EditionOutlineComplexItem } from '@awg-views/edition-view/models/edition-outline.model';

/**
 * The EditionComplexPartsList component.
 *
 * It contains the ordered list of the parts of a composite edition complex,
 * with links to the enabled parts.
 */
@Component({
    selector: 'awg-edition-complex-parts-list',
    templateUrl: './edition-complex-parts-list.component.html',
    styleUrl: './edition-complex-parts-list.component.scss',
    imports: [ConditionalLinkComponent],
})
export class EditionComplexPartsListComponent {
    /**
     * Readonly input signal: parts.
     *
     * It holds the outline items of the parts of a composite edition complex in their order.
     */
    readonly parts = input.required<EditionOutlineComplexItem[]>();
}
