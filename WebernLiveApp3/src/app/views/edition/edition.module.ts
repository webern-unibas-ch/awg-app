import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { EditionRoutingModule, routedEditionComponents } from './edition-routing.module';
import { EditionDetailModule } from './edition-detail/edition-detail.module';
import { EditionReportModule } from './edition-report/edition-report.module';

import { DataService, EditionService } from './services';


@NgModule({
    imports: [
        SharedModule,
        EditionDetailModule,
        EditionReportModule,
        EditionRoutingModule
    ],
    declarations: [ routedEditionComponents ]
})
export class EditionModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: EditionModule,
            providers: [ DataService, EditionService ]
        }
    }
}
