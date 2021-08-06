import { Injectable, TemplateRef } from '@angular/core';

export class Toast {
    textOrTpl: string | TemplateRef<any>;
    options: any;

    constructor(textOrTpl: string | TemplateRef<any>, options?: any) {
        this.textOrTpl = textOrTpl;
        this.options = options ? { ...options } : {};
    }
}

/**
 * The Toast service.
 *
 * It handles the displaying of toast messages.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class ToastService {
    /**
     * Public variable: toasts.
     *
     * It keeps the toast messages.
     */
    toasts: Toast[] = [];

    /**
     * Public method: add.
     *
     * It adds the toast with the message
     * represented by the given header and body to the toast array.
     *
     * @param {Toast} toast The given toast template.
     * @param {*} options The given toast options.
     *
     * @returns {void} Adds the toast message to the toast array.
     */
    add(toast: Toast): void {
        this.toasts.push(toast);
    }

    /**
     * Public method: remove.
     *
     * It deletes a given toast.
     *
     * @param { * } toast The given toast.
     *
     * @returns {void} Deletes the toast message.
     */
    remove(toast: Toast): void {
        this.toasts = this.toasts.filter(t => t !== toast);
    }
}
