import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { SearchRoutingModule, routedComponents } from './search-routing.module';

@NgModule({
    imports: [
        SharedModule,
        SearchRoutingModule,
    ],
    declarations: [
        routedComponents
    ]
})
export class SearchModule { }
