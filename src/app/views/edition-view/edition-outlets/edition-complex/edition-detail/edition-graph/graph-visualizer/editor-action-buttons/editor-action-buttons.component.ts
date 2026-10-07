import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/**
 * The EditorActionButtons component.
 *
 * It contains the action buttons (Query, Reset, Clear)
 * of the editors of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-editor-action-buttons',
    templateUrl: './editor-action-buttons.component.html',
    styleUrls: ['./editor-action-buttons.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class EditorActionButtonsComponent {
    /**
     * Readonly output signal: queryRequest.
     *
     * It emits a request to perform a query.
     */
    readonly queryRequest = output<void>();

    /**
     * Readonly output signal: resetRequest.
     *
     * It emits a request to reset the editor content.
     */
    readonly resetRequest = output<void>();

    /**
     * Readonly output signal: clearRequest.
     *
     * It emits a request to clear the editor content.
     */
    readonly clearRequest = output<void>();
}
