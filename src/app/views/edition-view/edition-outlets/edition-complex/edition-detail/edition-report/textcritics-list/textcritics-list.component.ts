import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { EDITION_UTILS } from '@awg-shared/utils/edition-utils';

import { EditionNavigationSheetTarget } from '@awg-views/edition-view/models/edition-navigation.model';
import { TextcriticsList } from '@awg-views/edition-view/models/textcritics.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionDisclaimerWorkeditionsComponent } from '@awg-views/edition-view/edition-disclaimer-workeditions/edition-disclaimer-workeditions.component';
import { EditionTkaEvaluationsComponent } from '../../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaLabelComponent } from '../../edition-tka/edition-tka-label/edition-tka-label.component';
import { EditionTkaTableComponent } from '../../edition-tka/edition-tka-table/edition-tka-table.component';

/**
 * The TextcriticsList component.
 *
 * It contains the list of textcritical comments
 * of the critical report of the edition view of the app
 * with an {@link EditionTkaTableComponent}.
 */
@Component({
    selector: 'awg-textcritics-list',
    templateUrl: './textcritics-list.component.html',
    styleUrls: ['./textcritics-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CompileHtmlDirective,
        EditionDisclaimerWorkeditionsComponent,
        EditionTkaEvaluationsComponent,
        EditionTkaLabelComponent,
        EditionTkaTableComponent,
        NgTemplateOutlet,
        NgbAccordionModule,
    ],
})
export class TextcriticsListComponent {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Readonly input signal: textcriticsListData.
     *
     * It holds the textcritics list data.
     */
    readonly textcriticsListData = input.required<TextcriticsList | null>();

    /**
     * Protected readonly variable: EDITION_UTILS.
     *
     * It keeps the reference to the {@link EDITION_UTILS} methods.
     */
    protected readonly EDITION_UTILS = EDITION_UTILS;

    /**
     * Public method: selectSvgSheet.
     *
     * It delegates the navigation to the given sheet navigation target
     * directly to the {@link EditionNavigationService}.
     *
     * @param {EditionNavigationSheetTarget} sheetTarget The given sheet navigation target.
     * @returns {void} Navigates to the selected SVG sheet.
     */
    selectSvgSheet(sheetTarget: EditionNavigationSheetTarget): void {
        if (!sheetTarget?.sheetId) {
            return;
        }
        this._navigationService.navigateToSvgSheet(sheetTarget);
    }
}
