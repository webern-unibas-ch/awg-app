import { ChangeDetectionStrategy, Component, Input, model } from '@angular/core';

import { LanguageId } from '@awg-shared/language-switcher/language.model';

import { IntroBlock } from '@awg-views/edition-view/models';

/**
 * The EditionIntroNav component.
 *
 * It contains the navigation for the intro
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-intro-nav',
    templateUrl: './edition-intro-nav.component.html',
    styleUrls: ['./edition-intro-nav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionIntroNavComponent {
    /**
     * Input variable: introBlockContent.
     *
     * It keeps the content blocks of the intro.
     */
    @Input()
    introBlockContent: IntroBlock[];

    /**
     * Input variable: notesLabel.
     *
     * It keeps the notes label of the intro.
     */
    @Input()
    notesLabel: string;

    /**
     * Model signal: selectedLanguage.
     *
     * It holds the selected language id.
     */
    selectedLanguage = model.required<LanguageId>();
}
