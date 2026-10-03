import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAnglesLeft, faListUl } from '@fortawesome/free-solid-svg-icons';

/**
 * The EditionSheetFacetToggle component.
 *
 * It contains the button to minimize or maximize
 * the sheet facet section of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-sheet-facet-toggle',
    templateUrl: './edition-sheet-facet-toggle.component.html',
    styleUrls: ['./edition-sheet-facet-toggle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent],
})
export class EditionSheetFacetToggleComponent {
    /**
     * Readonly model signal: isMinimized.
     *
     * It holds the minimized state of the sheet facet.
     * @default false
     */
    readonly isMinimized = model<boolean>(false);

    /**
     * Readonly computed signal: toggleIcon.
     *
     * It computes the fontawesome icon of the toggle button
     * depending on the minimized state of the sheet facet.
     */
    readonly toggleIcon = computed(() => (this.isMinimized() ? faListUl : faAnglesLeft));

    /**
     * Readonly computed signal: toggleLabel.
     *
     * It computes the title and aria label of the toggle button
     * depending on the minimized state of the sheet facet.
     */
    readonly toggleLabel = computed(() => (this.isMinimized() ? 'Maximize' : 'Minimize'));

    /**
     * Public method: toggle.
     *
     * It toggles the model signal {@link isMinimized}.
     *
     * @returns {void} Toggles the minimized state of the sheet facet.
     */
    toggle(): void {
        this.isMinimized.update(isMinimized => !isMinimized);
    }
}
