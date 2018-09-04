import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { EditionDetailModule } from './edition-outlets/edition-detail/edition-detail.module';
import { ReportModule } from './edition-outlets/report/report.module';
import { EditionRoutingModule, routedComponents } from './edition-routing.module';

import { DataService, EditionService } from './services';


@NgModule({
    imports: [
        SharedModule,
        EditionDetailModule,
        ReportModule,
        EditionRoutingModule,
    ],
    declarations: [ routedComponents ],
    providers: [ DataService, EditionService ]
})
export class EditionModule {}
