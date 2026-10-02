import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { SourceDescContentsComponent } from './source-desc-contents/source-desc-contents.component';
import { SourceDescCorrectionsComponent } from './source-desc-corrections/source-desc-corrections.component';
import { SourceDescDetailsComponent } from './source-desc-details/source-desc-details.component';
import { SourceDescWritingMaterialsComponent } from './source-desc-writing-materials/source-desc-writing-materials.component';
import { SourceDescriptionComponent } from './source-description.component';

/**
 * The source description module.
 *
 * It embeds the {@link SourceDescriptionComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [
        SharedModule,
        SourceDescCorrectionsComponent,
        SourceDescContentsComponent,
        SourceDescDetailsComponent,
        SourceDescWritingMaterialsComponent,
    ],
    declarations: [SourceDescriptionComponent],
    exports: [SourceDescriptionComponent],
})
export class SourceDescriptionModule {}
