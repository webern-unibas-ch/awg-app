import { Component, computed, inject, input } from '@angular/core';
import { UrlTree } from '@angular/router';

import { SourceList } from '@awg-views/edition-view/models/source-list.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';

import { SourceSiglumComponent } from '../source-siglum/source-siglum.component';

/**
 * The SourceList component.
 *
 * It contains the source list section
 * of the critical report
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-source-list',
    templateUrl: './source-list.component.html',
    styleUrl: './source-list.component.scss',
    imports: [CompileHtmlDirective, SourceSiglumComponent],
})
export class SourceListComponent {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Input variable: sourceListData.
     *
     * It keeps the source list data.
     */
    readonly sourceListData = input.required<SourceList | null>();

    /**
     * Readonly computed signal: sourceReportRoutes.
     *
     * It holds the route to the report fragment of each source with a description,
     * or null for sources without one.
     */
    readonly sourceReportRoutes = computed<(UrlTree | null)[]>(() =>
        (this.sourceListData()?.sources ?? []).map(({ hasDescription, linkTo }) =>
            hasDescription && linkTo
                ? this._navigationService.getReportFragmentRoute({ complexId: '', fragmentId: linkTo })
                : null
        )
    );
}
