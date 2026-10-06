import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { QueryParamsHandling, RouterLink, RouterLinkActive } from '@angular/router';

import { ClickDirective } from '@awg-shared/click/click.directive';

import { RouterLinkButton } from './router-link-button.model';

/**
 * The RouterLinkButtonGroup component.
 *
 * It contains grouped router link buttons.
 */
@Component({
    selector: 'awg-router-link-button-group',
    templateUrl: './router-link-button-group.component.html',
    styleUrls: ['./router-link-button-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ClickDirective, RouterLink, RouterLinkActive, UpperCasePipe],
})
export class RouterLinkButtonGroupComponent {
    /**
     * Readonly input signal: routerLinkButtons.
     *
     * It holds the array of router link buttons.
     */
    readonly routerLinkButtons = input<RouterLinkButton[]>([]);

    /**
     * Readonly input signal: queryParamsHandling.
     *
     * It holds a flag how to handle query params (preserve, merge or nothing '').
     * Defaults to nothing ''.
     */
    readonly queryParamsHandling = input<QueryParamsHandling>('');

    /**
     * Readonly output signal: selectButtonRequest.
     *
     * It emits the selected router link button.
     */
    readonly selectButtonRequest = output<RouterLinkButton>();

    /**
     * Public method: selectButton.
     *
     * It emits a selected router link button
     * to the {@link selectButtonRequest}.
     *
     * @param {RouterLinkButton} routerLinkButton The given router link button.
     * @returns {void} Emits the selected router link button.
     */
    selectButton(routerLinkButton: RouterLinkButton): void {
        if (routerLinkButton.disabled) {
            return;
        }
        this.selectButtonRequest.emit(routerLinkButton);
    }
}
