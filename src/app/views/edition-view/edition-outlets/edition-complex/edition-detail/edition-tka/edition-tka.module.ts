import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaDescriptionComponent } from './edition-tka-description/edition-tka-description.component';
import { EditionTkaTableComponent } from './edition-tka-table/edition-tka-table.component';

/**
 * The edition TkA table module.
 *
 * It embeds the {@link EditionTkaTableComponent}, {@link EditionTkaDescriptionComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [EditionTkaDescriptionComponent, EditionTkaTableComponent],
    exports: [EditionTkaDescriptionComponent, EditionTkaTableComponent],
})
export class EditionTkaModule {}
