import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { FolioModule } from '../edition-folio/folio.module';

import { EditionDetailNotificationComponent } from './edition-detail-notification';
import { EditionSheetControlComponent } from './edition-sheet-control';
import { EditionSvgPanelComponent } from './edition-svg-panel';
import { EditionTkaTableComponent } from './edition-tka-table';
import { EditionConvoluteComponent } from './edition-convolute';

@NgModule({
    imports: [
        SharedModule,
        FolioModule
    ],
    declarations: [
        EditionConvoluteComponent,
        EditionDetailNotificationComponent,
        EditionSheetControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent
    ],
    exports: [
        EditionConvoluteComponent,
        EditionDetailNotificationComponent,
        EditionSheetControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent

    ]
})
export class EditionDetailModule { }
