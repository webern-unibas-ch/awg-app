import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { UTILS } from '@awg-shared/utils/object-utils';
import { TextcriticalCommentary, Textcritics } from '@awg-views/edition-view/models';

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
    standalone: false,
})
export class EditionSvgSheetFooterComponent {
    /**
     * Input variable: selectedTextcritics.
     *
     * It keeps the selected textcritics of a selected svg sheet.
     */
    @Input()
    selectedTextcritics: Textcritics | undefined;

    /**
     * Input variable: selectedTextcriticalCommentary.
     *
     * It keeps the selected textcritical commentary.
     */
    @Input()
    selectedTextcriticalCommentary: TextcriticalCommentary | undefined;

    /**
     * Input variable: showTkA.
     *
     * If the textcritics shall be displayed.
     */
    @Input()
    showTkA = false;

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Public variable: faChevronRight.
     *
     * It instantiates fontawesome's faChevronRight icon.
     */
    faChevronRight = faChevronRight;

    /**
     * Public variable: faChevronDown.
     *
     * It instantiates fontawesome's faChevronDown icon.
     */
    faChevronDown = faChevronDown;

    /**
     * Public variable: showEvaluation.
     *
     * It keeps a boolean flag if the evaluation shall be displayed.
     */
    showEvaluation = false;

    /**
     * Public method: toggleEvaluation.
     *
     * It toogles the boolean switch for displaying the evaluation.
     *
     * @returns {void} Toggles the boolean flag.
     */
    toggleEvaluation(): void {
        this.showEvaluation = !this.showEvaluation;
    }
}
