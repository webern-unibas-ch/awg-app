import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The EditionTkaLabel component.
 *
 * It contains the label for the textcritical comments
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-tka-label',
    templateUrl: './edition-tka-label.component.html',
    styleUrl: './edition-tka-label.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionTkaLabelComponent {
    /**
     * Input variable: id.
     *
     * It keeps the id of the sheet or textcritics.
     */
    @Input() id: string;

    /**
     * Input variable: labelType.
     *
     * It keeps the type of the label.
     */
    @Input() labelType: 'evaluation' | 'comment';

    /**
     * Public method: isSketchId.
     *
     * It checks if the given id refers to a sketch.
     *
     * @param {string} id The given id.
     *
     * @returns {boolean} The result of the check.
     */
    isSketchId(id: string): boolean {
        return id?.includes('_Sk') || id?.includes('SkRT') || false;
    }
}
