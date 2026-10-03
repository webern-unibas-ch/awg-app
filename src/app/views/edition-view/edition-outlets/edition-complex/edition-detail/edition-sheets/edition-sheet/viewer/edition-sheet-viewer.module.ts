import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaEvaluationsComponent } from '../../../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaLabelComponent } from '../../../edition-tka/edition-tka-label/edition-tka-label.component';
import { EditionTkaTableComponent } from '../../../edition-tka/edition-tka-table/edition-tka-table.component';

import { EditionSheetViewerNavComponent } from './nav';
import { EditionSheetViewerSwitchComponent } from './switch';
import { EditionSheetViewerComponent } from './edition-sheet-viewer.component';

/**
 * The edition svg sheet viewer module.
 *
 * It embeds the {@link EditionSheetViewerComponent},
 * {@link EditionSheetViewerNavComponent},
 * {@link EditionSheetViewerSwitchComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaEvaluationsComponent, EditionTkaLabelComponent, EditionTkaTableComponent],
    declarations: [EditionSheetViewerComponent, EditionSheetViewerNavComponent, EditionSheetViewerSwitchComponent],
    exports: [EditionSheetViewerComponent, EditionSheetViewerNavComponent, EditionSheetViewerSwitchComponent],
})
export class EditionSheetViewerModule {}
