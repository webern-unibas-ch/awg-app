import { ChangeDetectionStrategy, Component, model } from '@angular/core';

import { LanguageId } from './language.model';

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
     * Model signal: selectedLanguage.
     *
     * It holds the selected language id.
     */
    selectedLanguage = model.required<LanguageId>();

    /**
     * Protected readonly variable: languages.
     *
     * It holds the available languages of the app.
     */
    protected readonly languages = Object.values(LanguageId)
        .filter((value): value is LanguageId => typeof value === 'number')
        .map(id => ({
            id,
            label: LanguageId[id],
        }));
}
