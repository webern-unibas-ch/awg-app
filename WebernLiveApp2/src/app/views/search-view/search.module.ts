import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { SearchRoutingModule, routedComponents } from './search-routing.module';
import { ApiService } from '../../api-service/api.service';
import { SearchService } from './search.service';
import { SearchFormComponent } from './search-outlets/search-panel/search-form/search-form.component';

@NgModule({
    imports: [
        SharedModule,
        SearchRoutingModule,
    ],
    declarations: [
        routedComponents,
        SearchFormComponent
    ]
})
export class SearchModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SearchModule,
            providers: [ ApiService, SearchService ]
        }
    }
}
