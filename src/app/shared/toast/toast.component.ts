import { Component, OnInit, TemplateRef } from '@angular/core';

import { ToastService } from '@awg-core/services';

/**
 * The Toast component.
 *
 * It contains a toast template that is
 * provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit {
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
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {}

    /**
     * Public method: isTemplate.
     *
     * It checks if a given toast is provided as a template or text.
     *
     * @param {*} toast The given queryResult.
     *
     * @returns {boolean} The boolean value of the comparison result.
     */
    isTemplate(toast: any): boolean {
        return toast.textOrTpl instanceof TemplateRef;
    }
}
