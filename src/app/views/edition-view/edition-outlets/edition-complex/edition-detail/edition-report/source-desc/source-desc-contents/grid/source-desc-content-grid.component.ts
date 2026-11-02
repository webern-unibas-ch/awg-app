import { Component, computed, inject, input } from '@angular/core';
import { UrlTree } from '@angular/router';

import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { SourceDescContent } from '@awg-views/edition-view/models/source-desc.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';

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
    styleUrl: './source-desc-content-grid.component.scss',
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
    readonly content = input.required<SourceDescContent | undefined>();

    /**
     * Readonly computed signal: parentComplexId.
     *
     * It holds the complex id the content item links to, or an empty string.
     */
    readonly parentComplexId = computed<string>(() => this.content()?.itemLinkTo?.complexId ?? '');

    /**
     * Readonly computed signal: folioRoutes.
     *
     * It holds the route to the sheet of each folio, or null if a folio has no link target.
     */
    readonly folioRoutes = computed<(UrlTree | null)[]>(() => {
        const complexId = this.parentComplexId();

        return (this.content()?.folios ?? []).map(({ folioLinkTo }) =>
            folioLinkTo ? this._navigationService.getSvgSheetRoute({ complexId, sheetId: folioLinkTo }) : null
        );
    });
}
