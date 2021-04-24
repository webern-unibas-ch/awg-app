import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { ResourceDetailModule } from './data-outlets/resource-detail/resource-detail.module';
// Bibliography module is lazy loaded, so not imported here

import { SearchFormComponent } from './data-outlets/search-panel/search-form/search-form.component';
import { SearchResultListComponent } from './data-outlets/search-panel/search-result-list/search-result-list.component';

/* Routing Module */
import { DataViewRoutingModule, routedDataViewComponents } from './data-view-routing.module';

/**
 * The dataView module.
 *
 * It embeds the data components and their [routing definition]{@link DataViewRoutingModule},
 * the {@link SearchFormComponent}, {@link SearchResultListComponent},
 * as well as the {@link ResourceDetailModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, ResourceDetailModule, DataViewRoutingModule],
    declarations: [routedDataViewComponents, SearchFormComponent, SearchResultListComponent],
})
export class DataViewModule {}
