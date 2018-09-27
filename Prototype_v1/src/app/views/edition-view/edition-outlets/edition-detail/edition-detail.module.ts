import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { FolioModule } from '../edition-folio/folio.module';

import { EditionAccoladeComponent } from './edition-accolade/edition-accolade.component';
import { EditionConvoluteComponent } from './edition-convolute';
import { EditionDetailNotificationComponent } from './edition-detail-notification';
import { EditionSheetControlComponent } from './edition-sheet-control';
import { EditionSvgPanelComponent } from './edition-svg-panel';
import { EditionTkaTableComponent } from './edition-tka-table';

@NgModule({
    imports: [
        SharedModule,
        FolioModule
    ],
    declarations: [
        EditionAccoladeComponent,
        EditionConvoluteComponent,
        EditionDetailNotificationComponent,
        EditionSheetControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent
    ],
    exports: [
        EditionAccoladeComponent,
        EditionConvoluteComponent,
        EditionDetailNotificationComponent,
        EditionSheetControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent

    ]
})
export class EditionDetailModule { }
