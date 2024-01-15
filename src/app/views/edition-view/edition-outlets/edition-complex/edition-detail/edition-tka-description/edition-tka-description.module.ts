import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaDescriptionComponent } from './edition-tka-description.component';

/**
 * The edition TkA description module.
 *
 * It embeds the {@link EditionTkaDescriptionComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [EditionTkaDescriptionComponent],
    exports: [EditionTkaDescriptionComponent],
})
export class EditionTkaDescriptionModule {}
