import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { AbbrDirective } from '@awg-shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { SourceDescriptionSystem } from '@awg-views/edition-view/models/source-description.model';

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
    readonly contentSystem = input.required<SourceDescriptionSystem>();

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
}
