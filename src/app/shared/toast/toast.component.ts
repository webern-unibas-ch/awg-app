import { Component, TemplateRef, inject } from '@angular/core';

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
    standalone: false,
})
export class ToastComponent {
    /**
     * Public variable: toastService.
     *
     * It keeps the instance of the injected ToastService.
     */
    toastService = inject(ToastService);

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
