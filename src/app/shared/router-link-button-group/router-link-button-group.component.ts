import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { QueryParamsHandling } from '@angular/router';

import { RouterLinkButton } from './router-link-button.model';

/**
 * The RouterLinkButtonGroup component.
 *
 * It contains grouped router link buttons
 * that are provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-router-link-button-group',
    templateUrl: './router-link-button-group.component.html',
    styleUrls: ['./router-link-button-group.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouterLinkButtonGroupComponent {
    /**
     * Input variable: buttonArray.
     *
     * It keeps the array of router link buttons.
     */
    @Input()
    buttonArray: RouterLinkButton[];

    /**
     * Optional input variable: queryParamsHandling.
     *
     * It keeps a flag how to handle query params (preserve, merge or nothing '').
     * Defaults to nothing ''.
     */
    @Input() queryParamsHandling?: QueryParamsHandling = '';

    /**
     * Output variable: selectButtonRequest.
     *
     * It keeps an event emitter for the selected router link button.
     */
    @Output()
    selectButtonRequest: EventEmitter<RouterLinkButton> = new EventEmitter<RouterLinkButton>();

    /**
     * Public method: selectButton.
     *
     * It emits a selected router link button
     * to the {@link selectButtonRequest}.
     *
     * @param {RouterLinkButton} routerLinkButton
     * The given router link button.
     * @returns {void}
     * Emits the selected router link button.
     */
    selectButton(routerLinkButton: RouterLinkButton): void {
        this.selectButtonRequest.emit(routerLinkButton);
    }
}
