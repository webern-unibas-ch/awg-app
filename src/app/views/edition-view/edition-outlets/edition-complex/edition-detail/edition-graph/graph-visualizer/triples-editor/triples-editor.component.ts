import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { turtle } from '@codemirror/legacy-modes/mode/turtle';

import { CmMode } from '@awg-shared/codemirror/codemirror.component';
import { ToastMessage } from '@awg-shared/toast/toast.service';

/**
 * The TriplesEditor component.
 *
 * It contains the editor for the RDF triples
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-triples-editor',
    templateUrl: './triples-editor.component.html',
    styleUrls: ['./triples-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriplesEditorComponent {
    /**
     * Input variable: triples.
     *
     * It keeps the input string for the RDF triples.
     */
    @Input()
    triples: string;

    /**
     * Input variable: isFullscreen.
     *
     * It keeps a boolean flag if fullscreenMode is set.
     */
    @Input()
    isFullscreen: boolean;

    /**
     * Output variable: errorMessageRequest.
     *
     * It keeps an event emitter to update the query string after editor changes.
     */
    @Output()
    errorMessageRequest: EventEmitter<ToastMessage> = new EventEmitter();

    /**
     * Output variable: performQueryRequest.
     *
     * It keeps an event emitter to perform a query.
     */
    @Output()
    performQueryRequest: EventEmitter<void> = new EventEmitter();

    /**
     * Output variable: resetTriplesRequest.
     *
     * It keeps an event emitter to reset the triples to their initial state.
     */
    @Output()
    resetTriplesRequest: EventEmitter<void> = new EventEmitter();

    /**
     * Output variable: updateTriplesRequest.
     *
     * It keeps an event emitter to update the triples after editor changes.
     */
    @Output()
    updateTriplesRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Public variable: cmTurtleMode.
     *
     * It keeps the Codemirror mode for the turtle panel.
     */
    cmTurtleMode: CmMode = turtle;

    /**
     * Public method: onEditorInputChange.
     *
     * It emits the given triples
     * to the {@link updateTriplesRequest}.
     *
     * @param {string} triples The given triples.
     *
     * @returns {void} Emits the triples.
     */
    onEditorInputChange(triples: string): void {
        this.updateTriplesRequest.emit(triples);
    }

    /**
     * Public method: performQuery.
     *
     * It emits a trigger to
     * the {@link performQueryRequest}.
     *
     * @returns {void} Triggers the request.
     */
    performQuery(): void {
        if (this.triples) {
            this.performQueryRequest.emit();
        } else {
            this.errorMessageRequest.emit(new ToastMessage('Empty triples', 'Please enter triple content.'));
        }
    }

    /**
     * Public method: resetTriples.
     *
     * It emits a trigger to
     * the {@link resetTriplesRequest}.
     *
     * @returns {void} Triggers the request.
     */
    resetTriples(): void {
        this.resetTriplesRequest.emit();
    }

    /**
     * Public method: isAccordionItemCollapsed.
     *
     * It returns a boolean flag if the accordion item should be collapsed.
     * It returns false if fullscreenMode is set, otherwise true.
     *
     * @returns {boolean} The boolean value of the comparison.
     */
    isAccordionItemCollapsed(): boolean {
        return this.isFullscreen ? false : true;
    }

    /**
     * Public method: isAccordionItemDisabled.
     *
     * It returns a boolean flag if the accordion item should be disabled.
     * It returns true if fullscreenMode is set, otherwise false.
     *
     * @returns {boolean} The boolean value of the comparison.
     */
    isAccordionItemDisabled(): boolean {
        return this.isFullscreen ? true : false;
    }
}
