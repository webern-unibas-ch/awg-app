import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
     * Input variable: jumbotronId.
     *
     * It keeps the id of the jumbotron.
     */
    @Input()
    jumbotronId: string;

    /**
     * Input variable: jumbotronTitle.
     *
     * It keeps the title of the jumbotron.
     */
    @Input()
    jumbotronTitle: string;
}
