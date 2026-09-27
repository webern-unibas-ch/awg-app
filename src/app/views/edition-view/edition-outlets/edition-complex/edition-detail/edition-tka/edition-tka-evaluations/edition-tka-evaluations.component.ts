import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

/**
 * The EditionTkaEvaluations component.
 *
 * It contains the evaluations for the textcritical commentary
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-tka-evaluations',
    templateUrl: './edition-tka-evaluations.component.html',
    styleUrls: ['./edition-tka-evaluations.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CompileHtmlDirective],
})
export class EditionTkaEvaluationsComponent {
    /**
     * Readonly input signal: evaluations.
     *
     * It holds the evaluations data.
     */
    readonly evaluations = input.required<string[]>();
}
