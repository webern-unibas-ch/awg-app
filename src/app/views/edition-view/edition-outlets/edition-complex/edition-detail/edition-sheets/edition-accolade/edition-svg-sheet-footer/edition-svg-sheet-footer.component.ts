import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TextcriticalCommentary, Textcritics } from '@awg-views/edition-view/models/textcritics.model';

import { EditionTkaEvaluationsComponent } from '../../../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaLabelComponent } from '../../../edition-tka/edition-tka-label/edition-tka-label.component';
import { EditionTkaTableComponent } from '../../../edition-tka/edition-tka-table/edition-tka-table.component';

/**
 * The EditionSvgSheetFooter component.
 *
 * It contains the footer of the svg sheet section
 * of the edition view of the app
 * and lets the user display textcritical comments.
 */
@Component({
    selector: 'awg-edition-svg-sheet-footer',
    templateUrl: './edition-svg-sheet-footer.component.html',
    styleUrls: ['./edition-svg-sheet-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionTkaEvaluationsComponent, EditionTkaLabelComponent, EditionTkaTableComponent],
})
export class EditionSvgSheetFooterComponent {
    /**
     * Readonly input signal: selectedTextcritics.
     *
     * It holds the selected textcritics of a selected svg sheet.
     */
    readonly selectedTextcritics = input.required<Textcritics>();

    /**
     * Readonly input signal: selectedTextcriticalCommentary.
     *
     * It holds the selected textcritical commentary.
     */
    readonly selectedTextcriticalCommentary = input<TextcriticalCommentary | undefined>(undefined);

    /**
     * Readonly input signal: showTkA.
     *
     * It holds a boolean flag if the textcritics shall be displayed.
     */
    readonly showTkA = input<boolean>(false);
}
