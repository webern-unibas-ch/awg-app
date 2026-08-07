import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { LanguageId } from '@awg-shared/language-switcher/language.model';

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
    standalone: false,
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
