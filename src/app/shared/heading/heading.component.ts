import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The Heading component.
 *
 * It contains a configurable heading.
 */
@Component({
    selector: 'awg-heading',
    templateUrl: 'heading.component.html',
    styleUrls: ['heading.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingComponent {
    /**
     * Readonly input signal: id.
     *
     * It holds the id of the heading.
     */
    readonly id = input.required<string>();

    /**
     * Readonly input signal: title.
     *
     * It holds the title of the heading.
     */
    readonly title = input.required<string>();
}
