import { Injectable, signal, TemplateRef } from '@angular/core';

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
     * Private readonly signal: _toasts.
     *
     * It holds the toast messages.
     */
    private readonly _toasts = signal<Toast[]>([]);

    /**
     * Readonly signal: toasts.
     *
     * It holds the toast messages (readonly).
     */
    readonly toasts = this._toasts.asReadonly();

    /**
     * Public method: add.
     *
     * It adds the given toast to the toast array.
     *
     * @param {Toast} toast The given toast.
     *
     * @returns {void} Adds the toast to the toast array.
     */
    add(toast: Toast): void {
        this._toasts.update(toasts => [...toasts, toast]);
    }

    /**
     * Public method: remove.
     *
     * It removes the given toast from the toast array.
     *
     * @param {Toast} toast The given toast.
     *
     * @returns {void} Removes the toast from the toast array.
     */
    remove(toast: Toast): void {
        this._toasts.update(toasts => toasts.filter(t => t !== toast));
    }
}
