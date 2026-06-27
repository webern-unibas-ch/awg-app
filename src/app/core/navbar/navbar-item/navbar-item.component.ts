import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';

import { NavbarItem } from '../models/navbar.model';

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
    imports: [NgbDropdownToggle, RouterLink, RouterLinkActive, FaIconComponent],
})
export class NavbarItemComponent {
    /**
     * Input signal: item.
     *
     * It holds the data for a single navigation item in the navbar.
     */
    item = input.required<NavbarItem>();

    /**
     * Input signal (): id.
     *
     * It holds the id of the navigation item in the navbar.
     * @default ''
     */
    id = input<string>('');

    /**
     * Input signal: isDropdown.
     *
     * It holds the boolean value if the navigation item is a dropdown or not.
     * @default false
     */
    isDropdown = input<boolean>(false);
}
