import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaModule } from '../../edition-tka/edition-tka.module';

import { SourceDescriptionCorrectionsComponent } from './source-description-corrections';
import { SourceDescriptionDetailsComponent } from './source-description-details';
import { SourceDescriptionComponent } from './source-description.component';

/**
 * The source description module.
 *
 * It embeds the {@link SourceDescriptionComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaModule],
    declarations: [
        SourceDescriptionComponent,
        SourceDescriptionDetailsComponent,
        SourceDescriptionCorrectionsComponent,
    ],
    exports: [SourceDescriptionComponent],
})
export class SourceDescriptionModule {}
