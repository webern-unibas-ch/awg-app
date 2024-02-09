import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaModule } from '../../../edition-tka/edition-tka.module';

import { EditionSvgSheetFooterComponent } from './edition-svg-sheet-footer.component';

/**
 * The edition svg sheet footer module.
 *
 * It embeds the {@link EditionSvgSheetFooterComponent}, {@link EditionTkaModule} as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaModule],
    declarations: [EditionSvgSheetFooterComponent],
    exports: [EditionSvgSheetFooterComponent],
})
export class EditionSvgSheetFooterModule {}
