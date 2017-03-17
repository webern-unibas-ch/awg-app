import { NgModule, ModuleWithProviders } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { SearchRoutingModule, routedSearchComponents } from './search-routing.module';

//
// services
import { ApiService } from '../../core/services/api-service/api.service';
import { ConversionService } from '../../core/services/conversion-service/conversion.service';

@NgModule({
    imports: [ SharedModule, SearchRoutingModule ],
    declarations: [ routedSearchComponents ]
})
export class SearchModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SearchModule,
            providers: [ ApiService, ConversionService ]
        }
    }
}
