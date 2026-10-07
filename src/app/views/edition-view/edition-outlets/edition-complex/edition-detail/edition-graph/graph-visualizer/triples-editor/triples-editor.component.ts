import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';

import { turtle } from '@codemirror/legacy-modes/mode/turtle';

import { CodeMirrorComponent } from '@awg-shared/codemirror/codemirror.component';
import { CmMode } from '@awg-shared/codemirror/codemirror.utils';
import { ToastMessage } from '@awg-shared/toast/toast.service';

import { EditorActionButtonsComponent } from '../editor-action-buttons/editor-action-buttons.component';

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
    imports: [NgbAccordionModule, CodeMirrorComponent, EditorActionButtonsComponent],
})
export class TriplesEditorComponent {
    /**
     * Model signal: triples.
     *
     * It holds the RDF triples (two-way bound with the editor).
     */
    readonly triples = model<string>('');

    /**
     * Readonly input signal: isFullscreenMode.
     *
     * It holds a boolean flag if fullscreenMode is set.
     * If true, the accordion item is open and disabled.
     */
    readonly isFullscreenMode = input<boolean>(false);

    /**
     * Readonly output signal: errorMessageRequest.
     *
     * It emits an error message to be displayed.
     */
    readonly errorMessageRequest = output<ToastMessage>();

    /**
     * Readonly output signal: performQueryRequest.
     *
     * It emits a request to perform a query.
     */
    readonly performQueryRequest = output<void>();

    /**
     * Readonly output signal: resetTriplesRequest.
     *
     * It emits a request to reset the triples to their initial state.
     */
    readonly resetTriplesRequest = output<void>();

    /**
     * Readonly variable: cmTurtleMode.
     *
     * It keeps the Codemirror mode for the turtle panel.
     */
    readonly cmTurtleMode: CmMode = turtle;

    /**
     * Public method: clearTriples.
     *
     * It clears the triples.
     *
     * @returns {void} Sets the triples to an empty string.
     */
    clearTriples(): void {
        this.triples.set('');
    }

    /**
     * Public method: performQuery.
     *
     * It emits a trigger to the {@link performQueryRequest}
     * if triples are given, otherwise an error message
     * to the {@link errorMessageRequest}.
     *
     * @returns {void} Triggers the request.
     */
    performQuery(): void {
        if (this.triples()) {
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
}
