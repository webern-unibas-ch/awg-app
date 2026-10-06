import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { QueryParamsHandling, RouterLink, RouterLinkActive } from '@angular/router';

import { ClickDirective } from '@awg-shared/click/click.directive';

import { NavLink } from './nav-link.model';

/**
 * The NavLinkGroup component.
 *
 * It contains grouped navigation links.
 */
@Component({
    selector: 'awg-nav-link-group',
    templateUrl: './nav-link-group.component.html',
    styleUrls: ['./nav-link-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ClickDirective, RouterLink, RouterLinkActive, UpperCasePipe],
})
export class NavLinkGroupComponent {
    /**
     * Readonly input signal: navLinks.
     *
     * It holds the array of nav links.
     */
    readonly navLinks = input<NavLink[]>([]);

    /**
     * Readonly input signal: queryParamsHandling.
     *
     * It holds a flag how to handle query params (preserve, merge or nothing '').
     * Defaults to nothing ''.
     */
    readonly queryParamsHandling = input<QueryParamsHandling>('');

    /**
     * Readonly output signal: selectNavLinkRequest.
     *
     * It emits the selected nav link.
     */
    readonly selectNavLinkRequest = output<NavLink>();

    /**
     * Public method: selectNavLink.
     *
     * It emits a selected nav link
     * to the {@link selectNavLinkRequest}.
     *
     * @param {NavLink} navLink The given nav link.
     * @returns {void} Emits the selected nav link.
     */
    selectNavLink(navLink: NavLink): void {
        if (navLink.disabled) {
            return;
        }
        this.selectNavLinkRequest.emit(navLink);
    }
}
