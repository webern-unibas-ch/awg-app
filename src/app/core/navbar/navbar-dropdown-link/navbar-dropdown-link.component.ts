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
     * Input signal: label.
     *
     * It holds the label of the dropdown link.
     */
    label = input.required<string>();

    /**
     * Input signal: route.
     *
     * It holds the route of the dropdown link.
     */
    route = input.required<string[]>();
}
