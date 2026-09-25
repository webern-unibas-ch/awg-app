import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

import { IntroBlock } from '@awg-views/edition-view/models/intro.model';

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
    imports: [CompileHtmlDirective],
})
export class EditionIntroContentComponent {
    /**
     * Readonly input signal: introBlockContent.
     *
     * It holds the content blocks of the intro.
     */
    readonly introBlockContent = input.required<IntroBlock[]>();

    /**
     * Readonly input signal: notesLabel.
     *
     * It holds the notes label of the intro.
     */
    readonly notesLabel = input.required<string>();
}
