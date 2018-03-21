import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ResourceDetailModule } from './data-outlets/resource-detail/resource-detail.module';
import { DataRoutingModule, routedComponents } from './data-routing.module';

import {
    HttpCacheService,
    DataApiService,
    DataStreamerService
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
        HttpCacheService,
        DataApiService,
        DataStreamerService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CachingInterceptor,
            multi: true
        }
    ]
})
export class SearchModule {}
