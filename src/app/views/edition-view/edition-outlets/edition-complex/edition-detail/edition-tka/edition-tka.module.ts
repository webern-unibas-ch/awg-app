import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionTkaEvaluationsComponent } from './edition-tka-evaluations';
import { EditionTkaLabelComponent } from './edition-tka-label';
import { EditionTkaTableComponent } from './edition-tka-table';

/**
 * The edition TkA table module.
 *
 * It embeds the {@link EditionTkaTableComponent}, {@link EditionTkaLabelComponent},
 * {@link EditionTkaEvaluationsComponent} as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [EditionTkaEvaluationsComponent, EditionTkaLabelComponent, EditionTkaTableComponent],
    exports: [EditionTkaEvaluationsComponent, EditionTkaLabelComponent, EditionTkaTableComponent],
})
export class EditionTkaModule {}
