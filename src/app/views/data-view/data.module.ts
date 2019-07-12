import { NgModule } from '@angular/core';

import { SharedModule } from '@awg-shared/shared.module';

import { ResourceDetailModule } from './data-outlets/resource-detail/resource-detail.module';
// bibliography module is lazy loaded, so not imported here

import { SearchFormComponent } from './data-outlets/search-panel/search-form/search-form.component';
import { SearchResultListComponent } from './data-outlets/search-panel/search-result-list/search-result-list.component';

/* Routing Module */
import { DataRoutingModule, routedDataComponents } from './data-routing.module';

/**
 * The data module.
 *
 * It embeds the data components and their [routing definition]{@link DataRoutingModule},
 * the {@link SearchFormComponent}, {@link SearchResultListComponent},
 * as well as the {@link ResourceDetailModule} and {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule, ResourceDetailModule, DataRoutingModule],
    declarations: [routedDataComponents, SearchFormComponent, SearchResultListComponent]
})
export class DataModule {}
