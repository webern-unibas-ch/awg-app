import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { httpInterceptorProviders } from './interceptors';

import { ResourceDetailModule } from './data-outlets/resource-detail/resource-detail.module';
import { DataRoutingModule, routedComponents } from './data-routing.module';
// bibliography module is lazy loaded, so not imported here

import { SearchFormComponent } from './data-outlets/search-panel/search-form/search-form.component';
import { SearchResultListComponent } from './data-outlets/search-panel/search-result-list/search-result-list.component';

@NgModule({
    imports: [
        SharedModule,
        ResourceDetailModule,
        DataRoutingModule
    ],
    declarations: [
        routedComponents,
        SearchFormComponent,
        SearchResultListComponent
    ],
    providers: [ httpInterceptorProviders ]
})
export class DataModule {}
