import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaModule } from '../../edition-tka/edition-tka.module';

import { SourceDescriptionComponent } from './source-description.component';

/**
 * The source description module.
 *
 * It embeds the {@link SourceDescriptionComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaModule],
    declarations: [SourceDescriptionComponent],
    exports: [SourceDescriptionComponent],
})
export class SourceDescriptionModule {}
