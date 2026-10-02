import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaEvaluationsComponent } from '../../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaLabelComponent } from '../../edition-tka/edition-tka-label/edition-tka-label.component';
import { EditionTkaTableComponent } from '../../edition-tka/edition-tka-table/edition-tka-table.component';

import { SourceDescContentGridComponent } from './source-desc-content-grid/source-desc-content-grid.component';
import { SourceDescriptionContentsComponent } from './source-description-contents/source-description-contents.component';
import { SourceDescriptionCorrectionsComponent } from './source-description-corrections/source-description-corrections.component';
import { SourceDescriptionDetailsComponent } from './source-description-details/source-description-details.component';
import { SourceDescriptionWritingMaterialsComponent } from './source-description-writing-materials/source-description-writing-materials.component';
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
        EditionTkaEvaluationsComponent,
        EditionTkaLabelComponent,
        EditionTkaTableComponent,
        SourceDescriptionCorrectionsComponent,
        SourceDescriptionContentsComponent,
        SourceDescContentGridComponent,
    ],
    declarations: [
        SourceDescriptionComponent,
        SourceDescriptionDetailsComponent,
        SourceDescriptionWritingMaterialsComponent,
    ],
    exports: [SourceDescriptionComponent],
})
export class SourceDescriptionModule {}
