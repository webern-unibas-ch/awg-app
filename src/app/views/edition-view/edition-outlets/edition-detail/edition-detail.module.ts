import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { FolioModule } from '../edition-folio/folio.module';
import { EditionTkaTableModule } from '../edition-tka-table/edition-tka-table.module';

import { EditionAccoladeComponent } from './edition-accolade/edition-accolade.component';
import { EditionConvoluteComponent } from './edition-convolute';
import { EditionDetailNotificationComponent } from './edition-detail-notification';
import { EditionSvgSheetNavComponent } from './edition-svg-sheet-nav';
import { EditionSvgSheetComponent } from './edition-svg-sheet';

/**
 * The edition detail module.
 *
 * It embeds the {@link EditionAccoladeComponent}, {@link EditionConvoluteComponent},
 * {@link EditionDetailNotificationComponent}, {@link EditionSvgSheetNavComponent},
 * {@link EditionSvgSheetComponent} as well as the {@link EditionTkaTableModule},
 * {@link FolioModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, FolioModule, EditionTkaTableModule],
    declarations: [
        EditionAccoladeComponent,
        EditionConvoluteComponent,
        EditionDetailNotificationComponent,
        EditionSvgSheetNavComponent,
        EditionSvgSheetComponent
    ],
    exports: [
        EditionAccoladeComponent,
        EditionConvoluteComponent,
        EditionDetailNotificationComponent,
        EditionSvgSheetNavComponent,
        EditionSvgSheetComponent
    ]
})
export class EditionDetailModule {}
