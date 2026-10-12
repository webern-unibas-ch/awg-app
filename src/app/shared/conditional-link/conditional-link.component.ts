import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * The ConditionalLink component.
 *
 * It conditionally renders a clickable link or a non-clickable content.
 */
@Component({
    selector: 'awg-conditional-link',
    templateUrl: './conditional-link.component.html',
    styleUrl: './conditional-link.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
})
export class ConditionalLinkComponent {
    /**
     * Readonly input signal: isClickable.
     *
     * It indicates whether the target is clickable.
     */
    readonly isClickable = input<boolean>(false);

    /**
     * Readonly output signal: clicked.
     *
     * It emits an event when the target is clicked.
     */
    readonly clicked = output<void>();
}
