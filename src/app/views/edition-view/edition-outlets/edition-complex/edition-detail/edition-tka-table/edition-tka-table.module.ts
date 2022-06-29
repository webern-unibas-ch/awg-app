import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaTableComponent } from './edition-tka-table.component';

/**
 * The edition TkA table module.
 *
 * It embeds the {@link EditionTkaTableComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [EditionTkaTableComponent],
    exports: [EditionTkaTableComponent],
})
export class EditionTkaTableModule {}
