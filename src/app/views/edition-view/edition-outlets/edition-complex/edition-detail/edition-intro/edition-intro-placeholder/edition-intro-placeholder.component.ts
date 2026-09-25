import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EditionComplex } from '@awg-views/edition-view/models';

/**
 * The EditionIntroPlaceholder component.
 *
 * It contains the placeholder for an empty intro
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-intro-placeholder',
    templateUrl: './edition-intro-placeholder.component.html',
    styleUrls: ['./edition-intro-placeholder.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class EditionIntroPlaceholderComponent {
    /**
     * Readonly input signal: editionComplex.
     *
     * It holds the editionComplex for the intro placeholder.
     */
    readonly editionComplex = input.required<EditionComplex | null>();
}
