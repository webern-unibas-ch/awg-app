import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { FolioModule } from '../edition-folio/folio.module';
import { EditionTkaTableModule } from '../edition-tka-table/edition-tka-table.module';

import { EditionAccoladeComponent } from './edition-accolade/edition-accolade.component';
import { EditionConvoluteComponent } from './edition-convolute';
import { EditionDetailNotificationComponent } from './edition-detail-notification';
import { EditionSvgFileNavComponent } from './edition-svg-file-nav';
import { EditionSvgFileComponent } from './edition-svg-file';

@NgModule({
    imports: [
        SharedModule,
        FolioModule,
        EditionTkaTableModule
    ],
    declarations: [
        EditionAccoladeComponent,
        EditionConvoluteComponent,
        EditionDetailNotificationComponent,
        EditionSvgFileNavComponent,
        EditionSvgFileComponent
    ],
    exports: [
        EditionAccoladeComponent,
        EditionConvoluteComponent,
        EditionDetailNotificationComponent,
        EditionSvgFileNavComponent,
        EditionSvgFileComponent

    ]
})
export class EditionDetailModule { }
