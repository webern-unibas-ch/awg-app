import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'awg-source-evaluation',
    templateUrl: './source-evaluation.component.html',
    styleUrls: ['./source-evaluation.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourceEvaluationComponent {
    /**
     * Output variable: openModalRequest.
     *
     * It keeps an event emitter to open the modal
     * with the selected modal text snippet.
     */
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();

    // todo check to remove
    @Output()
    scrollRequest: EventEmitter<any> = new EventEmitter();

    showEvaluationPanel = true;

    /**
     * Public method: openModal.
     *
     * It emits a given id of a modal snippet text
     * to the {@link openModalRequest}.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Emits the id.
     */
    openModal(id: string) {
        this.openModalRequest.emit(id);
    }

    /**
     * Public method: togglePanel.
     *
     * It toggles the showEvaluationPanel flag.
     *
     * @returns {boolean} Sets the showEvaluationPanel flag.
     */
    togglePanel(): boolean {
        return (this.showEvaluationPanel = !this.showEvaluationPanel);
    }
}
