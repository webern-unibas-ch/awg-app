import { Component, inject, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';

import { ModalData } from './modal.model';

/**
 * The Modal component.
 *
 * It contains a modal template that passes the modal data to the modal content component.
 */
@Component({
    selector: 'awg-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
    /**
     * Readonly injection variable: _activeModal.
     *
     * It keeps the instance of the injected NgbActiveModal.
     */
    readonly activeModal = inject(NgbActiveModal);

    /**
     * Input variable: modalData.
     *
     * It keeps the data for the modal content.
     *
     * @todo Use input signal as soon as NgbActiveModal supports signals
     */
    @Input() modalData: ModalData | undefined;
}
