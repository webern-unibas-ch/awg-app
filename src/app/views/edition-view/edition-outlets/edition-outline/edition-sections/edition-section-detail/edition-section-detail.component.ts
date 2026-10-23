import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * The EditionSectionDetail component.
 *
 * It contains the detail of a section
 * of the edition view of the app
 * with another router outlet for the section detail routes.
 *
 * The selected edition section is set by the {@link editionSectionResolver}
 * during the navigation.
 */
@Component({
    selector: 'awg-edition-section-detail',
    templateUrl: './edition-section-detail.component.html',
    styleUrl: './edition-section-detail.component.scss',
    imports: [RouterOutlet],
})
export class EditionSectionDetailComponent {
    // Intentionally left empty
}
