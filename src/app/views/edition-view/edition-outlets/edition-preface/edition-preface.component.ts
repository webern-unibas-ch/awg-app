import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { AlertErrorComponent } from '@awg-shared/alert-error/alert-error.component';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';
import { LanguageSwitcherComponent } from '@awg-shared/language-switcher/language-switcher.component';
import { LanguageId } from '@awg-shared/language-switcher/language.model';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

/**
 * The EditionPreface component.
 *
 * It contains the preface section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-preface',
    templateUrl: './edition-preface.component.html',
    styleUrls: ['./edition-preface.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AlertErrorComponent, CompileHtmlDirective, LanguageSwitcherComponent, TwelveToneSpinnerComponent],
})
export class EditionPrefaceComponent {
    /**
     * Readonly signal: viewData.
     *
     * It holds the state of the preface view data.
     */
    readonly viewData = inject(EditionViewService).prefaceViewData;

    /**
     * Public signal: selectedLanguage.
     *
     * It holds the selected language of the edition preface.
     */
    selectedLanguage = signal<LanguageId>(LanguageId.DE);
}
