import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaDescriptionComponent } from './edition-tka-description/edition-tka-description.component';
import { EditionTkaLabelComponent } from './edition-tka-label/edition-tka-label.component';
import { EditionTkaTableComponent } from './edition-tka-table/edition-tka-table.component';

/**
 * The edition TkA table module.
 *
 * It embeds the {@link EditionTkaTableComponent}, {@link EditionTkaLabelComponent},
 * {@link EditionTkaDescriptionComponent} as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [EditionTkaDescriptionComponent, EditionTkaLabelComponent, EditionTkaTableComponent],
    exports: [EditionTkaDescriptionComponent, EditionTkaLabelComponent, EditionTkaTableComponent],
})
export class EditionTkaModule {}
