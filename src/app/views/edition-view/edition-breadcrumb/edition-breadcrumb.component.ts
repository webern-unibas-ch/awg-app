import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
})
export class EditionBreadcrumbComponent {
    /**
     * Readonly input signal: items.
     *
     * It holds the labeled route items for the breadcrumb.
     */
    readonly items = input.required<LabeledRoute[]>();
}
