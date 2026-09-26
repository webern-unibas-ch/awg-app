import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaEvaluationsComponent } from '../../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaLabelComponent } from '../../edition-tka/edition-tka-label/edition-tka-label.component';
import { EditionTkaTableComponent } from '../../edition-tka/edition-tka-table/edition-tka-table.component';

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
    imports: [SharedModule, EditionTkaEvaluationsComponent, EditionTkaLabelComponent, EditionTkaTableComponent],
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
