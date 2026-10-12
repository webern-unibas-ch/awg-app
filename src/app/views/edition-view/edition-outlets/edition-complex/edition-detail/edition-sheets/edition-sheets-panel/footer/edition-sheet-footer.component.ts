import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Textcritics } from '@awg-views/edition-view/models/textcritics.model';
import { EditionTkaEvaluationsComponent } from '@awg-views/edition-view/shared/tka/evaluations/edition-tka-evaluations.component';
import { EditionTkaLabelComponent } from '@awg-views/edition-view/shared/tka/label/edition-tka-label.component';
import { EditionTkaTableComponent } from '@awg-views/edition-view/shared/tka/table/edition-tka-table.component';

/**
 * The EditionSheetFooter component.
 *
 * It contains the footer of the svg sheet section
 * of the edition view of the app
 * and lets the user display textcritical comments.
 */
@Component({
    selector: 'awg-edition-sheet-footer',
    templateUrl: './edition-sheet-footer.component.html',
    styleUrls: ['./edition-sheet-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionTkaEvaluationsComponent, EditionTkaLabelComponent, EditionTkaTableComponent],
})
export class EditionSheetFooterComponent {
    /**
     * Readonly input signal: selectedTextcritics.
     *
     * It holds the textcritics of the selected svg sheet
     * with the commentary filtered for the selected tkk overlays.
     */
    readonly selectedTextcritics = input.required<Textcritics>();

    /**
     * Readonly computed signal: showTkA.
     *
     * It holds a boolean flag whether the textcritical commentary shall be displayed
     * (i.e., whether the displayed commentary contains comments).
     */
    readonly showTkA = computed<boolean>(() => (this.selectedTextcritics().commentary?.comments?.length ?? 0) > 0);
}
