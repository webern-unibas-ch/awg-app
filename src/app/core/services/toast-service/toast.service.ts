import { Injectable, TemplateRef } from '@angular/core';

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
    toasts: any[] = [];

    /**
     * Public method: show.
     *
     * It shows the toast with the message
     * represented by the given header and body.
     *
     * @param {string | TemplateRef<*>} textOrTpl The given toast template.
     * @param {string} options The given toast options.
     *
     * @returns {void} Shows the toast message.
     */
    show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
        this.toasts.push({ textOrTpl, ...options });
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
    remove(toast: any): void {
        this.toasts = this.toasts.filter(t => t !== toast);
    }
}
