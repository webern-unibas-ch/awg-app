import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, TemplateRef } from '@angular/core';

import { NgbToast } from '@ng-bootstrap/ng-bootstrap/toast';

import { Toast, ToastService } from './toast.service';

/**
 * The Toast component.
 *
 * It displays the toasts of the {@link ToastService}.
 */
@Component({
    selector: 'awg-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbToast, NgTemplateOutlet],
})
export class ToastComponent {
    /**
     * Private readonly injection variable: _toastService.
     *
     * It keeps the instance of the injected ToastService.
     */
    private readonly _toastService = inject(ToastService);

    /**
     * Readonly signal: toasts.
     *
     * It holds the toasts of the ToastService.
     */
    readonly toasts = this._toastService.toasts;

    /**
     * Public method: isTemplate.
     *
     * It checks if a given toast is provided as a template or text.
     *
     * @param {string | TemplateRef<unknown>} value The toast value to check.
     * @returns {boolean} The boolean value of the check result.
     */
    isTemplate(value: string | TemplateRef<unknown>): value is TemplateRef<unknown> {
        return value instanceof TemplateRef;
    }

    /**
     * Public method: onHidden.
     *
     * It removes the given toast from the ToastService
     * after it has been hidden.
     *
     * @param {Toast} toast The given toast.
     * @returns {void} Removes the toast.
     */
    onHidden(toast: Toast): void {
        this._toastService.remove(toast);
    }
}
