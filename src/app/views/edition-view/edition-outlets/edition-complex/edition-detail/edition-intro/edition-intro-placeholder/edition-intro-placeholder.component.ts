import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
})
export class EditionIntroPlaceholderComponent {
    /**
     * Input variable: editionComplex.
     *
     * It keeps the editionComplex for the intro placeholder.
     */
    @Input()
    editionComplex: EditionComplex;

    /**
     * Input variable: editionLabel.
     *
     * It keeps the edition label for the intro placeholder.
     */
    @Input()
    editionLabel: string;
}
