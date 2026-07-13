import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';

import { NavbarItem } from '../navbar.model';

/**
 * The NavbarItem component.
 *
 * It contains a single navigation item in the navbar.
 */
@Component({
    selector: 'awg-navbar-item',
    templateUrl: './navbar-item.component.html',
    styleUrl: './navbar-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent, NgbDropdownToggle, RouterLink, RouterLinkActive],
})
export class NavbarItemComponent {
    /**
     * Readonly input signal: item.
     *
     * It holds the data for a single navigation item in the navbar.
     */
    readonly item = input.required<NavbarItem>();

    /**
     * Readonly input signal: id.
     *
     * It holds the id of the navigation item in the navbar.
     * @default ''
     */
    readonly id = input<string>('');

    /**
     * Readonly input signal: isDropdown.
     *
     * It holds a boolean value indicating whether the navigation item is a dropdown or not.
     * @default false
     */
    readonly isDropdown = input<boolean>(false);
}
