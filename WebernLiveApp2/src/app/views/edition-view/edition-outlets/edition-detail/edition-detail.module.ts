import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';

import { EditionDetailNotificationComponent } from './edition-detail-notification';
import { EditionSheetControlComponent } from './edition-sheet-control';
import { EditionSvgPanelComponent } from './edition-svg-panel';
import { EditionTkaTableComponent } from './edition-tka-table';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
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
        EditionTkaTableComponent
    ]
})
export class EditionDetailModule { }
