import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The Heading component.
 *
 * It contains a configurable h2 heading
 * that is provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-heading',
    templateUrl: 'heading.component.html',
    styleUrls: ['heading.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingComponent {
    /**
     * Input variable: title.
     *
     * It keeps the title of the heading.
     */
    @Input()
    title: string;

    /**
     * Input variable: id.
     *
     * It keeps the id of the heading.
     */
    @Input()
    id: string;
}
