import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

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
     * Input variable: currentLanguage.
     *
     * It keeps the current language: 0 for German, 1 for English.
     */
    @Input()
    currentLanguage: number;

    /**
     * Output variable: languageChangeRequest.
     *
     * It emits the current language.
     */
    @Output() languageChangeRequest = new EventEmitter<number>();

    /**
     * Public method: setLanguage.
     *
     * It emits the current language.
     *
     * @param {number} language The given language number.
     * @returns {void} Emits the current language.
     */
    setLanguage(language: number): void {
        if (language === 0 || language === 1) {
            this.languageChangeRequest.emit(language);
        }
    }
}
