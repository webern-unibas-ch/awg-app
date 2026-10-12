import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';

import { MODAL_DATA, ModalData } from './modal.model';

/**
 * The Modal component.
 *
 * It contains a modal template that displays the modal data
 * provided via the {@link MODAL_DATA} injection token.
 */
@Component({
    selector: 'awg-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
    /**
     * Readonly injection variable: activeModal.
     *
     * It keeps the instance of the injected NgbActiveModal.
     */
    readonly activeModal = inject(NgbActiveModal);

    /**
     * Readonly injection variable: modalData.
     *
     * It keeps the injected data for the modal content.
     */
    readonly modalData: ModalData = inject(MODAL_DATA);
}
