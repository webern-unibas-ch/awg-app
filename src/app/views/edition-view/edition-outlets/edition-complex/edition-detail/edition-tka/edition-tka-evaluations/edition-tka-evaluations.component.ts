import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
    standalone: false,
})
export class EditionTkaEvaluationsComponent {
    /**
     * Input variable: evaluations.
     *
     * It keeps the evaluations data.
     */
    @Input()
    evaluations: string[];
}
