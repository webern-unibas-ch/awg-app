import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionSheetsPanelComponent } from './edition-sheets-panel/edition-sheets-panel.component';
import { EditionFoliosPanelModule } from './edition-folios-panel/edition-folios-panel.module';
import { EditionSheetsRoutingModule, routedEditionSheetsComponents } from './edition-sheets-routing.module';

/**
 * The EditionSheets module.
 *
 * It embeds the edition sheets components and their
 * [routing definition]{@link EditionSheetsRoutingModule} as well as the
 * {@link EditionSheetsPanelComponent}, {@link EditionFoliosPanelModule}
 * and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionSheetsPanelComponent, EditionFoliosPanelModule, EditionSheetsRoutingModule],
    declarations: [routedEditionSheetsComponents],
})
export class EditionSheetsModule {}
