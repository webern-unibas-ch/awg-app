import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionSvgSheetFacetItemComponent } from './edition-svg-sheet-facet-item/edition-svg-sheet-facet-item.component';
import { EditionSvgSheetFacetComponent } from './edition-svg-sheet-facet.component';

/**
 * The edition svg sheet facet module.
 *
 * It embeds the {@link EditionSvgSheetFacetComponent}, {@link EditionSvgSheetFacetItemComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [EditionSvgSheetFacetComponent, EditionSvgSheetFacetItemComponent],
    exports: [EditionSvgSheetFacetComponent, EditionSvgSheetFacetItemComponent],
})
export class EditionSvgSheetFacetModule {}
