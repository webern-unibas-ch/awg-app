import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionSheetsPanelComponent } from './edition-sheets-panel/edition-sheets-panel.component';
import { EditionFoliosPanelComponent } from './edition-folios-panel/edition-folios-panel.component';
import { EditionSheetsRoutingModule, routedEditionSheetsComponents } from './edition-sheets-routing.module';

/**
 * The EditionSheets module.
 *
 * It embeds the edition sheets components and their
 * [routing definition]{@link EditionSheetsRoutingModule} as well as the
 * {@link EditionSheetsPanelComponent}, {@link EditionFoliosPanelComponent}
 * and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionSheetsPanelComponent, EditionFoliosPanelComponent, EditionSheetsRoutingModule],
    declarations: [routedEditionSheetsComponents],
})
export class EditionSheetsModule {}
