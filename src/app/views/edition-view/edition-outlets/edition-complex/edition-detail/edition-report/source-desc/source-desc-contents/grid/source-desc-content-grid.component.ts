import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { SourceDescriptionContent } from '@awg-views/edition-view/models/source-description.model';
import { EditionNavigationService, SheetClickEvent } from '@awg-views/edition-view/services/edition-navigation.service';

import { SourceDescContentFolioComponent } from '../folio/source-desc-content-folio.component';
import { SourceDescContentSystemComponent } from '../system/source-desc-content-system.component';

/**
 * The SourceDescContentGridComponent component.
 *
 * It contains the source description content grid
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-content-grid',
    templateUrl: './source-desc-content-grid.component.html',
    styleUrls: ['./source-desc-content-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CompileHtmlDirective,
        ConditionalLinkComponent,
        SourceDescContentFolioComponent,
        SourceDescContentSystemComponent,
    ],
})
export class SourceDescContentGridComponent {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Readonly input signal: contents.
     *
     * It holds the folio contents array.
     */
    readonly content = input.required<SourceDescriptionContent | undefined>();

    /**
     * Readonly computed signal: parentComplexId.
     *
     * It holds the complex id the content item links to, or an empty string.
     */
    readonly parentComplexId = computed<string>(() => this.content()?.itemLinkTo?.complexId || '');

    /**
     * Public method: selectSvgSheet.
     *
     * It delegates the navigation for the given complex and SVG sheet IDs
     * directly to the {@link EditionNavigationService}.
     *
     * @param {object} sheetIds The given sheet ids as SheetClickEvent.
     * @returns {void} Navigates to the selected SVG sheet.
     */
    selectSvgSheet(sheetIds: SheetClickEvent): void {
        if (!sheetIds?.sheetId) {
            return;
        }
        this._navigationService.navigateToSvgSheet(sheetIds);
    }
}
