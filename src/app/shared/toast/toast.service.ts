import { Injectable, TemplateRef } from '@angular/core';

/**
 * The ToastMessage class.
 *
 * It is used in the context of the app
 * to store and provide the data for a toast
 * to be displayed with ngb-toast.
 */
export class ToastMessage {
    /**
     * Public variable: name.
     *
     * It keeps the name of the toast.
     */
    name: string;

    /**
     * Public variable: message.
     *
     * It keeps the message of the toast to be displayed.
     */
    message: string;

    /**
     * Public variable: duration.
     *
     * It keeps the duration of the toast.
     */
    duration?: number;

    /**
     * Constructor of the Toast class.
     *
     * It initializes the class with given values.
     *
     * @param {string} name The name of the toast.
     * @param {string} message The message of the toast.
     * @param {number} [duration] The optional duration of the toast.
     */
    constructor(name: string, message: string, duration?: number) {
        this.name = name;
        this.message = message;
        this.duration = duration || 3000;
    }
}

/**
 * The Toast class.
 *
 * It is used in the context of the app
 * to store and provide the data for a toast
 * to be displayed with ngb-toast.
 */
export class Toast {
    /**
     * The text or template of the toast.
     */
    textOrTpl: string | TemplateRef<any>;
    /**
     * The options for the toast.
     */
    options: any;

    /**
     * Constructor of the Toast class.
     *
     * It initializes the class with given values.
     *
     * @param {string | TemplateRef<*>} textOrTpl The given text or template input.
     * @param {*} [options] The optional options input.
     */
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
