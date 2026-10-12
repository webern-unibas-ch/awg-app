import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { SourceSiglum } from '@awg-views/edition-view/models/source.model';

/**
 * The SourceSiglum component.
 *
 * It contains the source siglum section
 * of the critical report
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-source-siglum',
    templateUrl: './source-siglum.component.html',
    styleUrl: './source-siglum.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ConditionalLinkComponent],
})
export class SourceSiglumComponent {
    /**
     * Readonly input signal: siglumData.
     *
     * It holds the siglum data of the source.
     */
    readonly siglumData = input.required<SourceSiglum>();

    /**
     * Readonly input signal: isClickable.
     *
     * It indicates whether the source siglum is clickable.
     */
    readonly isClickable = input<boolean>(false);

    /**
     * Readonly input signal: classPrefix.
     *
     * It holds the class prefix for the component.
     */
    readonly classPrefix = input<string>('awg-source-list');

    /**
     * Readonly output signal: clicked.
     *
     * It emits an event when the source siglum is clicked.
     */
    readonly clicked = output<void>();

    /**
     * Readonly computed signal: hasMissingFlag.
     *
     * It computes whether the source has a missing flag.
     */
    readonly hasMissingFlag = computed(() => !!this.siglumData().missing);

    /**
     * Readonly computed signal: siglumContainerClass.
     *
     * It computes the CSS class for the siglum container.
     */
    readonly siglumContainerClass = computed(() => `${this.classPrefix()}-siglum-container`);

    /**
     * Readonly computed signal: siglumClass.
     *
     * It computes the CSS class for the siglum.
     */
    readonly siglumClass = computed(() => `${this.classPrefix()}-siglum`);

    /**
     * Readonly computed signal: siglumAddendumClass.
     *
     * It computes the CSS class for the siglum addendum.
     */
    readonly siglumAddendumClass = computed(() => `${this.classPrefix()}-siglum-addendum`);
}
