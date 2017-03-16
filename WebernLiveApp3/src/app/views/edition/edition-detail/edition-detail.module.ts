import { NgModule } from '@angular/core';
import { RouterModule }  from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

import { EditionDetailNotificationComponent } from './edition-detail-notification';
import { EditionDetailSheetControlComponent } from './edition-detail-sheet-control';
import { EditionDetailSvgPanelComponent } from './edition-detail-svg-panel';
import { EditionDetailTkaTableComponent } from './edition-detail-tka-table';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        EditionDetailNotificationComponent,
        EditionDetailSheetControlComponent,
        EditionDetailSvgPanelComponent,
        EditionDetailTkaTableComponent
    ],
    exports: [
        EditionDetailNotificationComponent,
        EditionDetailSheetControlComponent,
        EditionDetailSvgPanelComponent,
        EditionDetailTkaTableComponent
    ]
})
export class EditionDetailModule { }
