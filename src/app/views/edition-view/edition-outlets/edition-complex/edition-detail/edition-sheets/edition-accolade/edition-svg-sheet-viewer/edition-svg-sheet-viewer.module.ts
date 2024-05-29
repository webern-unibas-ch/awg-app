import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaModule } from '../../../edition-tka/edition-tka.module';

import { EditionSvgSheetViewerSwitchComponent } from './edition-svg-sheet-viewer-switch';
import { EditionSvgSheetViewerComponent } from './edition-svg-sheet-viewer.component';

/**
 * The edition svg sheet viewer module.
 *
 * It embeds the {@link EditionSvgSheetViewerComponent},
 * {@link EditionSvgSheetViewerSwitchComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaModule],
    declarations: [EditionSvgSheetViewerComponent, EditionSvgSheetViewerSwitchComponent],
    exports: [EditionSvgSheetViewerComponent, EditionSvgSheetViewerSwitchComponent],
})
export class EditionSvgSheetViewerModule {}
