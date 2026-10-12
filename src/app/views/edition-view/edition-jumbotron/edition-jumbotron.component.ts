import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The EditionJumbotron component.
 *
 * It contains the jumbotron
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-jumbotron',
    templateUrl: './edition-jumbotron.component.html',
    styleUrls: ['./edition-jumbotron.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionJumbotronComponent {
    /**
     * Readonly input signal: id.
     *
     * It holds the id of the jumbotron.
     */
    readonly id = input.required<string>();

    /**
     * Readonly input signal: title.
     *
     * It holds the title of the jumbotron.
     */
    readonly title = input.required<string>();
}
