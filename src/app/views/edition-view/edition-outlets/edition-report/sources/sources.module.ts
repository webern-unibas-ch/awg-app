import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { SourcesComponent } from './sources.component';
import { SourceDescriptionComponent } from './source-description';
import { SourceEvaluationComponent } from './source-evaluation';
import { SourceListComponent } from './source-list';

/**
 * The EditionSources module.
 *
 * It embeds the sources components as well as the
 * {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [SourcesComponent, SourceDescriptionComponent, SourceEvaluationComponent, SourceListComponent],
    exports: [SourcesComponent, SourceDescriptionComponent, SourceEvaluationComponent, SourceListComponent]
})
export class SourcesModule {}
