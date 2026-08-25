import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IntroBlock } from '@awg-views/edition-view/models';

/**
 * The EditionIntroContent component.
 *
 * It contains the content blocks for the intro
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-intro-content',
    templateUrl: './edition-intro-content.component.html',
    styleUrls: ['./edition-intro-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionIntroContentComponent {
    /**
     * Input variable: introBlockContent.
     *
     * It keeps the content blocks of the intro.
     */
    @Input()
    introBlockContent: IntroBlock[] = [];

    /**
     * Input variable: notesLabel.
     *
     * It keeps the notes label of the intro.
     */
    @Input()
    notesLabel = '';
}
