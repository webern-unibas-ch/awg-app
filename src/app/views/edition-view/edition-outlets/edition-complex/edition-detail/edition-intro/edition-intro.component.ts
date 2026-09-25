import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { AlertErrorComponent } from '@awg-shared/alert-error/alert-error.component';
import { LanguageId } from '@awg-shared/language-switcher/language.model';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionIntroContentComponent } from './edition-intro-content/edition-intro-content.component';
import { EditionIntroNavComponent } from './edition-intro-nav/edition-intro-nav.component';
import { EditionIntroPartialDisclaimerComponent } from './edition-intro-partial-disclaimer/edition-intro-partial-disclaimer.component';
import { EditionIntroPlaceholderComponent } from './edition-intro-placeholder/edition-intro-placeholder.component';
import { EditionIntroScrollDirective } from './edition-intro-scroll/edition-intro-scroll.directive';

/**
 * The EditionIntro component.
 *
 * It contains the intro section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-intro',
    templateUrl: './edition-intro.component.html',
    styleUrls: ['./edition-intro.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AlertErrorComponent,
        EditionIntroContentComponent,
        EditionIntroNavComponent,
        EditionIntroPartialDisclaimerComponent,
        EditionIntroPlaceholderComponent,
        EditionIntroScrollDirective,
        TwelveToneSpinnerComponent,
    ],
})
export class EditionIntroComponent {
    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = inject(EditionStateService).selectedEditionComplex;

    /**
     * Readonly signal: introData.
     *
     * It holds the state of the intro view data.
     */
    readonly viewData = inject(EditionViewService).introViewData;

    /**
     * Public signal: selectedLanguage.
     *
     * It holds the selected language of the edition intro.
     */
    selectedLanguage = signal<LanguageId>(LanguageId.DE);

    /**
     * Readonly signal: notesSectionLabel.
     *
     * It computes the label for the notes section in the edition intro based on the selected language.
     */
    readonly notesSectionLabel = computed(() => (this.selectedLanguage() === LanguageId.DE ? 'Anmerkungen' : 'Notes'));
}
