import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaEvaluationsComponent } from '../../../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaTableComponent } from '../../../edition-tka/edition-tka-table/edition-tka-table.component';

import { EditionSheetViewerNavComponent } from './nav/edition-sheet-viewer-nav.component';
import { EditionSheetViewerAdditionsPanelComponent } from './additions-panel/edition-sheet-viewer-additions-panel.component';
import { EditionSheetViewerComponent } from './edition-sheet-viewer.component';

/**
 * The edition svg sheet viewer module.
 *
 * It embeds the {@link EditionSheetViewerComponent},
 * {@link EditionSheetViewerNavComponent},
 * {@link EditionSheetViewerAdditionsPanelComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [
        SharedModule,
        EditionSheetViewerNavComponent,
        EditionSheetViewerAdditionsPanelComponent,
        EditionTkaEvaluationsComponent,
        EditionTkaTableComponent,
    ],
    declarations: [EditionSheetViewerComponent],
    exports: [EditionSheetViewerComponent, EditionSheetViewerNavComponent, EditionSheetViewerAdditionsPanelComponent],
})
export class EditionSheetViewerModule {}
