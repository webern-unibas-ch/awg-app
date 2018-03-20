import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { SearchRoutingModule, routedSearchComponents } from './search-routing.module';

//
// services
import { ApiService } from '../../core/services/api-service/api.service';
import { ConversionService } from '../../core/services/conversion-service/conversion.service';
import { SearchService } from './search.service';

import { SearchFulltextFormComponent } from './search-fulltext/search-fulltext-form/search-fulltext-form.component';
import { SearchFulltextResultsComponent } from './search-fulltext/search-fulltext-results/search-fulltext-results.component';

@NgModule({
    imports: [ SharedModule, SearchRoutingModule ],
    declarations: [ routedSearchComponents, SearchFulltextFormComponent, SearchFulltextResultsComponent ]
})
export class SearchModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SearchModule,
            providers: [ ApiService, ConversionService, SearchService ]
        };
    }
}
