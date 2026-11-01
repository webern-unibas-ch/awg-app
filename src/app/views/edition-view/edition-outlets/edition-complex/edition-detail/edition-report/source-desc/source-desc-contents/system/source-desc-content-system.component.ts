import { Component, computed, inject, input } from '@angular/core';
import { UrlTree } from '@angular/router';

import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';
import { OBJECT_UTILS } from '@awg-shared/utils/object-utils';

import { SourceDescSystem, SourceDescSystemRow } from '@awg-views/edition-view/models/source-desc.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';
import { AbbrDirective } from '@awg-views/edition-view/shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';

/**
 * The SourceDescContentSystem component.
 *
 * It contains the source description content system
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-content-system',
    templateUrl: './source-desc-content-system.component.html',
    styleUrl: './source-desc-content-system.component.scss',
    imports: [AbbrDirective, CompileHtmlDirective, ConditionalLinkComponent],
})
export class SourceDescContentSystemComponent {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Readonly input signal: complexId.
     *
     * It holds the id of the complex the system links to
     * (empty for the selected complex).
     */
    readonly complexId = input<string>('');

    /**
     * Readonly input signal: contentSystem.
     *
     * It holds the content system data.
     */
    readonly contentSystem = input.required<SourceDescSystem>();

    /**
     * Readonly input signal: isLastItem.
     *
     * It determines whether this item is the last one.
     */
    readonly isLastItem = input<boolean>(false);

    /**
     * Readonly computed signal: validRow.
     *
     * It holds the row of the current system if it has at least one property, otherwise undefined.
     */
    readonly validRow = computed<SourceDescSystemRow | undefined>(() => {
        const row = this.contentSystem().row;
        return OBJECT_UTILS.isEmptyObject(row) ? undefined : row;
    });

    /**
     * Readonly computed signal: hasDivider.
     *
     * It checks whether the divider colon should be displayed,
     * i.e. if a system description, a measure or a valid row is given.
     */
    readonly hasDivider = computed<boolean>(() => {
        const system = this.contentSystem();
        return !!system.systemDescription || !!system.measure || !!this.validRow();
    });

    /**
     * Readonly computed signal: isClickable.
     *
     * It checks whether the current system has a link target.
     */
    readonly isClickable = computed<boolean>(() => !!this.contentSystem().linkTo);

    /**
     * Readonly computed signal: targetRoute.
     *
     * It holds the route to the sheet the system links to, or null if it is not clickable.
     */
    readonly targetRoute = computed<UrlTree | null>(() => {
        const sheetId = this.contentSystem().linkTo;
        return sheetId ? this._navigationService.getSvgSheetRoute({ complexId: this.complexId(), sheetId }) : null;
    });
}
