import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaModule } from '../../edition-tka/edition-tka.module';

import { SourceDescriptionContentTableComponent } from './source-description-content-table';
import { SourceDescriptionContentsComponent } from './source-description-contents';
import { SourceDescriptionCorrectionsComponent } from './source-description-corrections';
import { SourceDescriptionDetailsComponent } from './source-description-details';
import { SourceDescriptionWritingMaterialsComponent } from './source-description-writing-materials';
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
        SourceDescriptionContentsComponent,
        SourceDescriptionContentTableComponent,
        SourceDescriptionCorrectionsComponent,
        SourceDescriptionDetailsComponent,
        SourceDescriptionWritingMaterialsComponent,
    ],
    exports: [SourceDescriptionComponent],
})
export class SourceDescriptionModule {}
