import { Component, output } from '@angular/core';

/**
 * The GraphEditorActionButtons component.
 *
 * It contains the action buttons (Query, Reset, Clear)
 * of the editors of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-graph-editor-action-buttons',
    templateUrl: './graph-editor-action-buttons.component.html',
    styleUrl: './graph-editor-action-buttons.component.scss',
})
export class GraphEditorActionButtonsComponent {
    /**
     * Readonly output signal: queryRequest.
     *
     * It emits a request to perform a query.
     */
    readonly queryRequest = output();

    /**
     * Readonly output signal: resetRequest.
     *
     * It emits a request to reset the editor content.
     */
    readonly resetRequest = output();

    /**
     * Readonly output signal: clearRequest.
     *
     * It emits a request to clear the editor content.
     */
    readonly clearRequest = output();
}
