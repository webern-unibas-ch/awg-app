import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * The NavbarDropdownLink component.
 *
 * It contains a single dropdown link for the navbar.
 */
@Component({
    selector: 'awg-navbar-dropdown-link',
    templateUrl: './navbar-dropdown-link.component.html',
    styleUrl: './navbar-dropdown-link.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive],
})
export class NavbarDropdownLinkComponent {
    /**
     * Readonly input signal: label.
     *
     * It holds the label of the dropdown link.
     */
    readonly label = input.required<string>();

    /**
     * Readonly input signal: route.
     *
     * It holds the route of the dropdown link.
     */
    readonly route = input.required<string[]>();
}
