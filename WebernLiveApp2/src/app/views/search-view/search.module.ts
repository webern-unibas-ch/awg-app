import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { SearchRoutingModule, routedComponents } from './search-routing.module';

import { BibliographyService, SearchService } from './services';

import { SearchFormComponent } from './search-outlets/search-panel/search-form/search-form.component';
import { SearchResultListComponent } from './search-outlets/search-panel/search-result-list/search-result-list.component';

import { ResourceDetailHtmlComponent } from './search-outlets/resource-detail/resource-detail-html/resource-detail-html.component';
import { ResourceDetailJsonConvertedComponent } from './search-outlets/resource-detail/resource-detail-json-converted/resource-detail-json-converted.component';
import { ResourceDetailJsonRawComponent } from './search-outlets/resource-detail/resource-detail-json-raw/resource-detail-json-raw.component';

import { BibliographySearchComponent } from './search-outlets/bibliography/bibliography-search/bibliography-search.component';
import { BibliographyListComponent } from './search-outlets/bibliography/bibliography-list/bibliography-list.component';
import { BibliographyFormatPipe } from './search-outlets/bibliography/bibliography-format.pipe';

@NgModule({
    imports: [
        SharedModule,
        SearchRoutingModule,
    ],
    declarations: [
        routedComponents,
        SearchFormComponent,
        SearchResultListComponent,

        ResourceDetailHtmlComponent,
        ResourceDetailJsonConvertedComponent,
        ResourceDetailJsonRawComponent,

        BibliographySearchComponent,
        BibliographyListComponent,
        BibliographyFormatPipe
    ]
})
export class SearchModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SearchModule,
            providers: [ SearchService, BibliographyService ]
        };
    }
}
