import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';

import { FormSwitchComponent } from '@awg-shared/form-switch/form-switch.component';

import { EditionSvgOverlayTypes } from '@awg-views/edition-view/models/edition-svg-overlay.model';
import { EditionTkaLabelComponent } from '@awg-views/edition-view/shared/tka/label/edition-tka-label.component';

import {
    EDITION_SHEET_VIEWER_SUPPLIED_CLASS_LABELS,
    EditionSheetViewerAdditionsPanelChange,
} from './edition-sheet-viewer-additions-panel.model';

/**
 * The EditionSheetViewerAdditionsPanel component.
 *
 * It contains a panel of switches that lets the user show and hide
 * the editorial additions of the svg sheet (supplied classes and tkk overlays),
 * e.g. to study the sheet without them.
 */
@Component({
    selector: 'awg-edition-sheet-viewer-additions-panel',
    templateUrl: './edition-sheet-viewer-additions-panel.component.html',
    styleUrls: ['./edition-sheet-viewer-additions-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionTkaLabelComponent, FormSwitchComponent],
})
export class EditionSheetViewerAdditionsPanelComponent {
    /**
     * Readonly input signal: sheetId.
     *
     * It holds the id of the selected svg sheet.
     */
    readonly sheetId = input.required<string>();

    /**
     * Readonly input signal: suppliedClasses.
     *
     * It holds the names of the supplied classes of the selected svg sheet.
     */
    readonly suppliedClasses = input.required<readonly string[]>();

    /**
     * Readonly input signal: hasTkkOverlays.
     *
     * It holds a boolean flag whether there are available tkk overlays.
     */
    readonly hasTkkOverlays = input<boolean>(false);

    /**
     * Readonly output signal: visibilityChange.
     *
     * It emits the key of an editorial addition together with its requested visibility.
     */
    readonly visibilityChange = output<EditionSheetViewerAdditionsPanelChange>();

    /**
     * Readonly variable: inputIdPrefix.
     *
     * It keeps the prefix of the checkbox ids (to avoid collisions with other ids on the page).
     */
    readonly inputIdPrefix = 'awg-addition-';

    /**
     * Readonly variable: tkkKey.
     *
     * It keeps the key of the tkk overlays as editorial addition.
     */
    readonly tkkKey = EditionSvgOverlayTypes.tkk;

    /**
     * Readonly variable: suppliedClassLabels.
     *
     * It keeps the display labels of the supplied classes.
     */
    readonly suppliedClassLabels = EDITION_SHEET_VIEWER_SUPPLIED_CLASS_LABELS;

    /**
     * Readonly computed signal: additionsKeys.
     *
     * It holds the keys of all editorial additions
     * (supplied class names and, if available, the tkk key).
     */
    readonly additionsKeys = computed<string[]>(() => [
        ...this.suppliedClasses(),
        ...(this.hasTkkOverlays() ? [this.tkkKey] : []),
    ]);

    /**
     * Readonly linked signal: visibility.
     *
     * It holds the visibility of each editorial addition (all visible for new addition keys).
     */
    readonly visibility = linkedSignal<ReadonlyMap<string, boolean>>(
        () => new Map(this.additionsKeys().map(key => [key, true]))
    );

    /**
     * Readonly computed signal: allVisible.
     *
     * It holds a boolean flag whether all editorial additions are visible.
     */
    readonly allVisible = computed<boolean>(() => [...this.visibility().values()].every(Boolean));

    /**
     * Public method: toggle.
     *
     * It toggles the visibility of a single editorial addition and emits the change.
     *
     * @param {string} key The given addition key.
     * @returns {void} Toggles the visibility of the editorial addition.
     */
    toggle(key: string): void {
        const isVisible = !this.visibility().get(key);

        this.visibility.update(visibility => new Map(visibility).set(key, isVisible));
        this.visibilityChange.emit({ key, isVisible });
    }

    /**
     * Public method: toggleAll.
     *
     * It shows all editorial additions, or hides them if all are visible already,
     * and emits each change.
     *
     * @returns {void} Toggles the visibility of all editorial additions.
     */
    toggleAll(): void {
        const isVisible = !this.allVisible();

        this.visibility.update(visibility => new Map([...visibility.keys()].map(key => [key, isVisible])));
        this.visibility().forEach((_isVisible, key) => this.visibilityChange.emit({ key, isVisible }));
    }
}
