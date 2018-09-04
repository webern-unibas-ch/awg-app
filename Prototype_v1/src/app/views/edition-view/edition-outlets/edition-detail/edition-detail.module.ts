import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { FolioModule } from './edition-folio/folio.module';

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
        EditionDetailNotificationComponent,
        EditionSheetControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent
    ],
    exports: [
        EditionDetailNotificationComponent,
        EditionSheetControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent,
        FolioModule
    ]
})
export class EditionDetailModule { }
