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
     * Input signal: id.
     *
     * It holds the id of the heading.
     * @default ''
     */
    id = input<string>('');

    /**
     * Input signal: title.
     *
     * It holds the title of the heading.
     * @default ''
     */
    title = input<string>('');
}
