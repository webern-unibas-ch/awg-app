import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { SheetNavigationTarget } from '@awg-views/edition-view/models/edition-navigation.model';
import { SourceDescContent } from '@awg-views/edition-view/models/source-desc.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

/**
 * The SourceDescContentItem component.
 *
 * It contains the source description content item (with its description)
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-content-item',
    templateUrl: './source-desc-content-item.component.html',
    styleUrl: './source-desc-content-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CompileHtmlDirective, ConditionalLinkComponent],
})
export class SourceDescContentItemComponent {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Readonly input signal: content.
     *
     * It holds the content data.
     */
    readonly content = input.required<SourceDescContent>();

    /**
     * Readonly computed signal: sheetTarget.
     *
     * It holds the sheet navigation target of the content item.
     */
    readonly sheetTarget = computed<SheetNavigationTarget>(() => {
        const itemLinkTo = this.content().itemLinkTo;
        return {
            complexId: itemLinkTo?.complexId ?? '',
            sheetId: itemLinkTo?.sheetId ?? '',
        };
    });

    /**
     * Readonly computed signal: isClickable.
     *
     * It holds true if both the complex and the sheet id are given.
     */
    readonly isClickable = computed<boolean>(() => {
        const { complexId, sheetId } = this.sheetTarget();
        return !!(complexId && sheetId);
    });

    /**
     * Public method: selectSvgSheet.
     *
     * It delegates the navigation to the given sheet navigation target
     * directly to the {@link EditionNavigationService}.
     *
     * @param {SheetNavigationTarget} sheetTarget The given sheet navigation target.
     * @returns {void} Navigates to the selected SVG sheet.
     */
    selectSvgSheet(sheetTarget: SheetNavigationTarget): void {
        if (!sheetTarget?.sheetId) {
            return;
        }
        this._navigationService.navigateToSvgSheet(sheetTarget);
    }
}
