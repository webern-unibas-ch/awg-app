import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { SourceDescContentsComponent } from './source-desc-contents/source-desc-contents.component';
import { SourceDescCorrectionsComponent } from './source-desc-corrections/source-desc-corrections.component';
import { SourceDescDetailsComponent } from './source-desc-details/source-desc-details.component';
import { SourceDescriptionWritingMaterialsComponent } from './source-description-writing-materials/source-description-writing-materials.component';
import { SourceDescriptionComponent } from './source-description.component';

/**
 * The source description module.
 *
 * It embeds the {@link SourceDescriptionComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, SourceDescCorrectionsComponent, SourceDescContentsComponent, SourceDescDetailsComponent],
    declarations: [SourceDescriptionComponent, SourceDescriptionWritingMaterialsComponent],
    exports: [SourceDescriptionComponent],
})
export class SourceDescriptionModule {}
