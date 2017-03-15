import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

//
// edition-detail
import { EditionSheetControlComponent } from './edition-detail/edition-sheet-control/edition-sheet-control.component';
import { EditionSvgPanelComponent } from './edition-detail/edition-svg-panel/edition-svg-panel.component';
import { EditionTkaTableComponent } from './edition-detail/edition-tka-table/edition-tka-table.component';

//
// edition routes & service
import { EditionRoutingModule, routedEditionComponents } from './edition-routing.module';
import { EditionService } from './edition.service';


@NgModule({
    imports: [ SharedModule, EditionRoutingModule ],
    declarations: [
        routedEditionComponents,
        EditionSheetControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent ]
})
export class EditionModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: EditionModule,
            providers: [ EditionService ]
        }
    }
}
