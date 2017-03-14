import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { SearchRoutingModule, routedSearchComponents } from './search-routing.module';

@NgModule({
    imports: [ SharedModule, SearchRoutingModule ],
    declarations: [ routedSearchComponents ]
})
export class SearchModule { }
