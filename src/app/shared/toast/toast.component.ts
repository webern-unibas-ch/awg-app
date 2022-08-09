import { Component, TemplateRef } from '@angular/core';

import { Toast, ToastService } from './toast.service';

/**
 * The Toast component.
 *
 * It contains a toast template that is
 * provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
    /**
     * Constructor of the ToastComponent.
     *
     * It declares a public ToastService instance
     * to handle the toast messages.
     *
     * @param {ToastService} toastService Instance of the ToastService.
     */
    constructor(public toastService: ToastService) {}

    /**
     * Public method: isTemplate.
     *
     * It checks if a given toast is provided as a template or text.
     *
     * @param {*} toast The given queryResult.
     *
     * @returns {boolean} The boolean value of the check result.
     */
    isTemplate(toast: Toast): boolean {
        return toast.textOrTpl instanceof TemplateRef;
    }
}
