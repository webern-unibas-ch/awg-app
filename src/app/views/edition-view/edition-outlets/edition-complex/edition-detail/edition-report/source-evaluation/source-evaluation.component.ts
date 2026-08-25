import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { UTILS } from '@awg-shared/utils/object-utils';
import { EditionComplex, SourceEvaluationList } from '@awg-views/edition-view/models';

/**
 * The SourceEvaluation component.
 *
 * It contains the source evaluation section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-evaluation',
    templateUrl: './source-evaluation.component.html',
    styleUrls: ['./source-evaluation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SourceEvaluationComponent {
    /**
     * Input variable:  editionComplex.
     *
     * It keeps the information about the current edition complex.
     */
    @Input()
    editionComplex: EditionComplex | null = null;

    /**
     * Input variable: sourceEvaluationListData.
     *
     * It keeps the source evaluation data.
     */
    @Input()
    sourceEvaluationListData: SourceEvaluationList | null = null;

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;
}
