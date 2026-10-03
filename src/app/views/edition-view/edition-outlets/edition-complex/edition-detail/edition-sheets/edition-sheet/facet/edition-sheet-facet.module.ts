import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionDisclaimerWorkeditionsComponent } from '@awg-views/edition-view/edition-disclaimer-workeditions/edition-disclaimer-workeditions.component';

import { EditionSheetFacetItemComponent } from './item/edition-sheet-facet-item.component';
import { EditionSheetFacetComponent } from './edition-sheet-facet.component';

/**
 * The edition svg sheet facet module.
 *
 * It embeds the {@link EditionSheetFacetComponent}, {@link EditionSheetFacetItemComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionDisclaimerWorkeditionsComponent],
    declarations: [EditionSheetFacetComponent, EditionSheetFacetItemComponent],
    exports: [EditionSheetFacetComponent, EditionSheetFacetItemComponent],
})
export class EditionSheetFacetModule {}
