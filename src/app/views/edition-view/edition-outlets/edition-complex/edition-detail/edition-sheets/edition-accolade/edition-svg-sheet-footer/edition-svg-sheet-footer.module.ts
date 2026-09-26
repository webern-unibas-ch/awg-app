import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaEvaluationsComponent } from '../../../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaLabelComponent } from '../../../edition-tka/edition-tka-label/edition-tka-label.component';
import { EditionTkaTableComponent } from '../../../edition-tka/edition-tka-table/edition-tka-table.component';

import { EditionSvgSheetFooterComponent } from './edition-svg-sheet-footer.component';

/**
 * The edition svg sheet footer module.
 *
 * It embeds the {@link EditionSvgSheetFooterComponent}, as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, EditionTkaEvaluationsComponent, EditionTkaLabelComponent, EditionTkaTableComponent],
    declarations: [EditionSvgSheetFooterComponent],
    exports: [EditionSvgSheetFooterComponent],
})
export class EditionSvgSheetFooterModule {}
