import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { SearchRoutingModule, routedComponents } from './search-routing.module';

import { SearchService } from './search.service';
import { BibliographyService } from './search-outlets/bibliography/bibliography.service';

import { SearchFormComponent } from './search-outlets/search-panel/search-form/search-form.component';

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
        }
    }
}
