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
     * Public variable: allClassesVisible.
     *
     * It keeps a boolean flag whether all classes are visible.
     */
    allClassesVisible = true;

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
}
