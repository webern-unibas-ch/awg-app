import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule} from '../../../../shared/shared.module';

import {
    SourcesComponent,
    SourceDescriptionComponent,
    SourceEvaluationComponent,
    SourceListComponent } from './sources';
import { TextcriticsComponent } from './textcritics';

@NgModule({
    imports: [
        RouterModule,
        SharedModule
    ],
    declarations: [
        SourcesComponent,
        SourceDescriptionComponent,
        SourceEvaluationComponent,
        SourceListComponent,
        TextcriticsComponent
    ],
    exports: [
        SourcesComponent,
        SourceDescriptionComponent,
        SourceEvaluationComponent,
        SourceListComponent,
        TextcriticsComponent
    ]
})
export class ReportModule { }
