import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

/**
 * The SourceDescDetails component.
 *
 * It contains the source description details section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-details',
    templateUrl: './source-desc-details.component.html',
    styleUrls: ['./source-desc-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CompileHtmlDirective],
})
export class SourceDescDetailsComponent {
    /**
     * Readonly input signal: details.
     *
     * It holds the details array.
     */
    readonly details = input.required<string[]>();

    /**
     * Readonly input signal: detailsClass.
     *
     * It holds the class name for the details.
     */
    readonly detailsClass = input.required<string>();

    /**
     * Readonly input signal: detailsLabel.
     *
     * It holds the label for the details.
     */
    readonly detailsLabel = input<string>('');

    /**
     * Readonly computed signal: hasPunctuation.
     *
     * It checks whether the details should be separated by punctuation marks
     * (all details classes except `conditions`).
     */
    readonly hasPunctuation = computed<boolean>(() => this.detailsClass() !== 'conditions');
}
