import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaTableModule } from '../edition-tka-table/edition-tka-table.module';

import {
    SourcesComponent,
    SourceDescriptionComponent,
    SourceEvaluationComponent,
    SourceListComponent
} from './sources';
import { CriticsListComponent, TextcriticsComponent } from './textcritics';

/**
 * The report module.
 *
 * It embeds the report components as well as the
 * {@link EditionTkaTableModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaTableModule],
    declarations: [
        SourcesComponent,
        SourceDescriptionComponent,
        SourceEvaluationComponent,
        SourceListComponent,
        CriticsListComponent,
        TextcriticsComponent
    ],
    exports: [
        SourcesComponent,
        SourceDescriptionComponent,
        SourceEvaluationComponent,
        SourceListComponent,
        CriticsListComponent,
        TextcriticsComponent
    ]
})
export class ReportModule {}
