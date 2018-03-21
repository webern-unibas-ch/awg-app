import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { SearchRoutingModule, routedComponents } from './search-routing.module';
import { BibliographyModule } from './search-outlets/bibliography/bibliography.module';


import {
    HttpCacheService,
    SearchService,
    SearchResultStreamerService
} from './services';
import { CachingInterceptor } from './interceptors';

import { SearchFormComponent } from './search-outlets/search-panel/search-form/search-form.component';
import { SearchResultListComponent } from './search-outlets/search-panel/search-result-list/search-result-list.component';

import { ResourceDetailHtmlComponent } from './search-outlets/resource-detail/resource-detail-html/resource-detail-html.component';
import { ResourceDetailHtmlContentComponent } from './search-outlets/resource-detail/resource-detail-html/resource-detail-html-content/resource-detail-html-content.component';
import { ResourceDetailHtmlContentImageobjectsComponent } from './search-outlets/resource-detail/resource-detail-html/resource-detail-html-content/imageobjects/imageobjects.component';
import { ResourceDetailHtmlContentLinkedobjectsComponent } from './search-outlets/resource-detail/resource-detail-html/resource-detail-html-content/linkedobjects/linkedobjects.component';
import { ResourceDetailHtmlContentPropsComponent } from './search-outlets/resource-detail/resource-detail-html/resource-detail-html-content/props/props.component';
import { ResourceDetailHtmlHeaderComponent } from './search-outlets/resource-detail/resource-detail-html/resource-detail-html-header/resource-detail-html-header.component';
import { ResourceDetailJsonConvertedComponent } from './search-outlets/resource-detail/resource-detail-json-converted/resource-detail-json-converted.component';
import { ResourceDetailJsonRawComponent } from './search-outlets/resource-detail/resource-detail-json-raw/resource-detail-json-raw.component';




@NgModule({
    imports: [
        SharedModule,
        BibliographyModule,
        SearchRoutingModule,
    ],
    declarations: [
        routedComponents,
        SearchFormComponent,
        SearchResultListComponent,

        ResourceDetailHtmlComponent,
        ResourceDetailHtmlContentComponent,
        ResourceDetailHtmlContentImageobjectsComponent,
        ResourceDetailHtmlContentLinkedobjectsComponent,
        ResourceDetailHtmlContentPropsComponent,
        ResourceDetailHtmlHeaderComponent,
        ResourceDetailJsonConvertedComponent,
        ResourceDetailJsonRawComponent
    ],
    providers: [
        HttpCacheService,
        SearchService,
        SearchResultStreamerService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CachingInterceptor,
            multi: true
        }
    ]
})
export class SearchModule {}
