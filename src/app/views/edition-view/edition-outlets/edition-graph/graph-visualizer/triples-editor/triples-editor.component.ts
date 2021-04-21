import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbAccordion, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import 'codemirror/mode/turtle/turtle';

/**
 * The TriplesEditor component.
 *
 * It contains the editor for the RDF triples
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-triples-editor',
    templateUrl: './triples-editor.component.html',
    styleUrls: ['./triples-editor.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriplesEditorComponent implements OnInit {
    /**
     * ViewChild variable: triplesAcc.
     *
     * It keeps the reference to the NgbAccordion.
     */
    @ViewChild('triplesAcc') triplesAcc: NgbAccordion;

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
     * Public variable: cmTriplesConfig.
     *
     * It keeps the Codemirror configuration for the triples panel.
     */
    cmTriplesConfig = {
        lineNumbers: true,
        firstLineNumber: 1,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'turtle'
    };

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {}

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
        if (!triples) {
            return;
        }
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
        this.performQueryRequest.emit();
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
     * Public method: preventPanelCollapseOnFullscreen.
     *
     * It prevents the given panel event from being collapsed in fullscreen mode.
     *
     * @returns {void} Prevents the panel collapse.
     */
    preventPanelCollapseOnFullscreen($event: NgbPanelChangeEvent): void {
        if (this.isFullscreen && $event.nextState === false) {
            $event.preventDefault();
        }
    }

    /**
     * Public method: togglePanel.
     *
     * It returns the id of the panel to be toggled if fullscreen mode is set,
     * otherwise empty string.
     *
     * @returns {string} The id of the panel to be toggled.
     */
    togglePanel(): string {
        return this.isFullscreen ? 'awg-graph-visualizer-triples' : '';
    }
}
