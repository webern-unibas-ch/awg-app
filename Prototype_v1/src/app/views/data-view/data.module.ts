import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from '@awg-shared/shared.module';

import { ResourceDetailModule } from './data-outlets/resource-detail/resource-detail.module';
import { DataRoutingModule, routedComponents } from './data-routing.module';
// bibliography module is lazy loaded, so not imported here

import {
    DataApiService,
    HttpCacheService
} from './services';
import { CachingInterceptor } from './interceptors';

import { SearchFormComponent } from './data-outlets/search-panel/search-form/search-form.component';
import { SearchResultListComponent } from './data-outlets/search-panel/search-result-list/search-result-list.component';

@NgModule({
    imports: [
        SharedModule,
        ResourceDetailModule,
        DataRoutingModule,
    ],
    declarations: [
        routedComponents,
        SearchFormComponent,
        SearchResultListComponent
    ],
    providers: [
        DataApiService,
        HttpCacheService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CachingInterceptor,
            multi: true
        }
    ]
})
export class DataModule {}
