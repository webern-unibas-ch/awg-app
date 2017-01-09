import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditionsRoutingModule } from './editions-routing.module';

import { EditionService } from './edition.service';

import { EditionViewComponent} from './edition-view.component';
import { EditionHeadingComponent } from './edition-heading/edition-heading.component';
import { EditionSvgPanelComponent } from './edition-svg-panel/edition-svg-panel.component';
import { EditionImageControlComponent } from './edition-image-control/edition-image-control.component';
import { EditionTkaTableComponent } from './edition-tka-table/edition-tka-table.component';


@NgModule({
    imports: [
        CommonModule,
        EditionsRoutingModule
    ],
    declarations: [
        EditionViewComponent,
        EditionHeadingComponent,
        EditionImageControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent,
    ],
    providers: [
        EditionService
    ]
})
export class EditionsModule { }
