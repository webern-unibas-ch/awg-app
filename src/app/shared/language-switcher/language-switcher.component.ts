import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * The LanguageSwitcher component.
 *
 * It contains the language switcher of the app.
 */
@Component({
    selector: 'awg-language-switcher',
    templateUrl: './language-switcher.component.html',
    styleUrls: ['./language-switcher.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
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
