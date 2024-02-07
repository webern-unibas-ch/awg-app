import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'awg-edition-svg-sheet-viewer-settings',
    templateUrl: './edition-svg-sheet-viewer-settings.component.html',
    styleUrl: './edition-svg-sheet-viewer-settings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionSvgSheetViewerSettingsComponent {
    /**
     * Input variable: suppliedClasses.
     *
     * It keeps the classes for the edition svg sheet viewer settings component.
     */
    @Input() suppliedClasses: Map<string, boolean>;

    /**
     * Output variable: selectOverlaysRequest.
     *
     * It keeps an event emitter for the selected svg overlays.
     */
    @Output()
    toggleSuppliedClassesOpacityRequest: EventEmitter<{ className: string; isCurrentlyVisible: boolean }> =
        new EventEmitter();

    /**
     * Output variable: toggleTkkClassesHighlightRequest.
     *
     * It keeps an event emitter for the tkk classes highlighting.
     */
    @Output()
    toggleTkkClassesHighlightRequest: EventEmitter<boolean> = new EventEmitter();

    /**
     * Public variable: allClassesVisible.
     *
     * It keeps a boolean flag whether all classes are visible.
     */
    allClassesVisible = true;

    /**
     * Public variable: tkkHighlightingVisible.
     *
     * It keeps a boolean flag whether the tkk highlighting is visible.
     */
    tkkHighlightingVisible = true;

    /**
     * Public method: toggleSingleSuppliedClassOpacity.
     *
     * It toggles the visibility of a single supplied class.
     *
     * @param className The class name.
     *
     * @returns {void} Toggles the visibility of a single supplied class.
     */
    toggleSingleSuppliedClassOpacity(className: string): void {
        const isSuppliedClassVisible = this.suppliedClasses.get(className) || false;
        this._onSuppliedClassesOpacityToggle(className, isSuppliedClassVisible);
        this.suppliedClasses.set(className, !isSuppliedClassVisible);

        // Update allClassesVisible flag
        const visibilityOfAllValues = Array.from(this.suppliedClasses.values());
        if (visibilityOfAllValues.every(value => value === visibilityOfAllValues[0])) {
            this.allClassesVisible = visibilityOfAllValues[0];
        }
    }

    /**
     * Public method: toggleAllSuppliedClassesOpacity.
     *
     * It toggles the visibility of all supplied classes.
     *
     * @returns {void} Toggles the visibility of all supplied classes.
     */
    toggleAllClassesOpacity(): void {
        this._onSuppliedClassesOpacityToggle(undefined, this.allClassesVisible);
        this.allClassesVisible = !this.allClassesVisible;

        // Update visibility of supplied classes if allClassesVisible flag changes
        this.suppliedClasses.forEach((_value, key) => {
            this.suppliedClasses.set(key, this.allClassesVisible);
        });

        // Call toggleTkkClassesHighlight to toggle tkkHighlightingVisible and emit the request
        this.toggleTkkClassesHighlight(this.allClassesVisible);
    }

    /**
     * Public method: toggleTkkClassesHighlight.
     *
     * It toggles the visibility of the tkk classes highlighting.
     *
     * @param {boolean} [isVisible] The value to set tkkHighlightingVisible to. If not provided, tkkHighlightingVisible is toggled.
     *
     * @returns {void} Toggles the visibility of the tkk classes highlighting.
     */
    toggleTkkClassesHighlight(isVisible?: boolean): void {
        if (isVisible !== undefined) {
            this.tkkHighlightingVisible = isVisible;
        } else {
            this.tkkHighlightingVisible = !this.tkkHighlightingVisible;
        }
        this.toggleTkkClassesHighlightRequest.emit(this.tkkHighlightingVisible);

        // Update allClassesVisible flag
        this._updateAllClassesVisibility();
    }

    /**
     * Public method: onSuppliedClassesOpacityToggle.
     *
     * It emits the supplied classes opacity toggle request.
     *
     * @param className The class name.
     * @param isCurrentlyVisible The visibility of the class.
     *
     * @returns {void} Emits the supplied classes opacity toggle request.
     */
    private _onSuppliedClassesOpacityToggle(className: string, isCurrentlyVisible: boolean): void {
        this.toggleSuppliedClassesOpacityRequest.emit({ className, isCurrentlyVisible });
    }

    /**
     * Private method: _updateAllClassesVisibility.
     *
     * It updates the visibility of all classes.
     *
     * @returns {void} Updates the visibility of all classes.
     */
    private _updateAllClassesVisibility(): void {
        const allValues = [...Array.from(this.suppliedClasses.values()), this.tkkHighlightingVisible];
        const allValuesTrue = allValues.every(value => value);
        const allValuesFalse = allValues.every(value => !value);

        if (allValuesTrue || allValuesFalse) {
            this.allClassesVisible = allValues[0];
        }
    }
}
