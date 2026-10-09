import { InjectionToken } from '@angular/core';

/**
 * The ModalType type.
 *
 * It defines the possible types of modal data, either 'text' or 'image'.
 */
export type ModalType = 'text' | 'image';

/**
 * The ModalData interface.
 *
 * It defines the structure of the data used in the modal component.
 */
export interface ModalData {
    /**
     * The type of the modal data.
     */
    type: ModalType;

    /**
     * The identifier for the modal data.
     */
    id: string;

    /**
     * The title of the modal data.
     */
    title: string;

    /**
     * The content of the modal data, which can be text or an image source.
     */
    content: string;
}

/**
 * The injection token for the modal data.
 *
 * It provides the {@link ModalData} to the ModalComponent
 * via the injector of the opened modal.
 */
export const MODAL_DATA = new InjectionToken<ModalData>('MODAL_DATA');
