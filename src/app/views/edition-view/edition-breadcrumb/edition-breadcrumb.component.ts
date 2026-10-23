import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { LabeledRoute } from '@awg-shared/models/labeled-route.model';

/**
 * The EditionBreadcrumbComponent.
 *
 * It displays the breadcrumb of the edition view.
 */
@Component({
    selector: 'awg-edition-breadcrumb',
    templateUrl: './edition-breadcrumb.component.html',
    styleUrl: './edition-breadcrumb.component.scss',
    imports: [FaIconComponent, RouterLink],
})
export class EditionBreadcrumbComponent {
    /**
     * Readonly input signal: items.
     *
     * It holds the labeled route items for the breadcrumb.
     */
    readonly items = input.required<LabeledRoute[]>();

    /**
     * Readonly variable: faChevronRight.
     *
     * It instantiates fontawesome's faChevronRight icon (divider between the items).
     */
    readonly faChevronRight = faChevronRight;
}
