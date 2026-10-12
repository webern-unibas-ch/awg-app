import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { SourceDescSystem } from '@awg-views/edition-view/models/source-desc.model';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AbbrDirective, CompileHtmlDirective, ConditionalLinkComponent],
})
export class SourceDescContentSystemComponent {
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
     * Readonly output signal: clicked.
     *
     * It emits an event when the target is clicked.
     */
    readonly clicked = output<void>();

    /**
     * Readonly computed signal: hasValidRow.
     *
     * It checks whether the current system has a valid row object with at least one property.
     */
    readonly hasValidRow = computed<boolean>(() => {
        const row = this.contentSystem().row;
        if (!row) {
            return false;
        }
        return Object.keys(row).length > 0;
    });

    /**
     * Readonly computed signal: hasDivider.
     *
     * It checks whether the divider colon should be displayed,
     * i.e. if a system description, a measure or a valid row is given.
     */
    readonly hasDivider = computed<boolean>(() => {
        const system = this.contentSystem();
        return !!(system.systemDescription || system.measure || this.hasValidRow());
    });

    /**
     * Readonly computed signal: isClickable.
     *
     * It checks whether the current system has a link target.
     */
    readonly isClickable = computed<boolean>(() => !!this.contentSystem().linkTo);
}
