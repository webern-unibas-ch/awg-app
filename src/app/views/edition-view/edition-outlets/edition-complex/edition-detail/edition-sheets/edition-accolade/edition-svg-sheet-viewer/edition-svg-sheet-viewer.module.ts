import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaEvaluationsComponent } from '../../../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaLabelComponent } from '../../../edition-tka/edition-tka-label/edition-tka-label.component';
import { EditionTkaTableComponent } from '../../../edition-tka/edition-tka-table/edition-tka-table.component';

import { EditionSvgSheetViewerNavComponent } from './edition-svg-sheet-viewer-nav';
import { EditionSvgSheetViewerSwitchComponent } from './edition-svg-sheet-viewer-switch';
import { EditionSvgSheetViewerComponent } from './edition-svg-sheet-viewer.component';

/**
 * The edition svg sheet viewer module.
 *
 * It embeds the {@link EditionSvgSheetViewerComponent},
 * {@link EditionSvgSheetViewerNavComponent},
 * {@link EditionSvgSheetViewerSwitchComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaEvaluationsComponent, EditionTkaLabelComponent, EditionTkaTableComponent],
    declarations: [
        EditionSvgSheetViewerComponent,
        EditionSvgSheetViewerNavComponent,
        EditionSvgSheetViewerSwitchComponent,
    ],
    exports: [EditionSvgSheetViewerComponent, EditionSvgSheetViewerNavComponent, EditionSvgSheetViewerSwitchComponent],
})
export class EditionSvgSheetViewerModule {}
