import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionSvgSheetNavItemComponent } from './edition-svg-sheet-nav-item/edition-svg-sheet-nav-item.component';
import { EditionSvgSheetNavComponent } from './edition-svg-sheet-nav.component';

/**
 * The edition svg sheet nav module.
 *
 * It embeds the {@link EditionSvgSheetNavComponent}, {@link EditionSvgSheetNavItemComponent}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [EditionSvgSheetNavComponent, EditionSvgSheetNavItemComponent],
    exports: [EditionSvgSheetNavComponent, EditionSvgSheetNavItemComponent],
})
export class EditionSvgSheetNavModule {}
