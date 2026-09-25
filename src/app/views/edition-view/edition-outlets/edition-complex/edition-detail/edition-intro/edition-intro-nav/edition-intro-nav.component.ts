import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageSwitcherComponent } from '@awg-shared/language-switcher/language-switcher.component';
import { LanguageId } from '@awg-shared/language-switcher/language.model';

import { IntroBlock } from '@awg-views/edition-view/models/intro.model';

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
    imports: [LanguageSwitcherComponent, RouterLink],
})
export class EditionIntroNavComponent {
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

    /**
     * Model signal: selectedLanguage.
     *
     * It holds the selected language id.
     */
    selectedLanguage = model.required<LanguageId>();
}
